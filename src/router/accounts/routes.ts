import {
  sha3Hash,
  signToken,
  verifyToken,
  ACCESS_TOKEN,
  BEARER,
  HttpError,
  AUTHORIZATION,
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  INTERNAL,
  UNAUTHORIZED,
  CANT_SIGN_JWT_TOKEN,
} from "../../commons";
import crypt from "bcrypt";

import { NextFunction, Request, Response } from "express";
import { UserProfile } from "./UserProfile";
import { CredentialsData, ProfileData } from "./types";
import {
  CANT_COMPARE_PASSWORD,
  INVALID_BODY_DATA,
  INVALID_LOGIN_CREDENTIALS,
  USER_PROFILE_EXISTS,
} from "./constants";

//TODO: Mejorar
function isProfileData(data: any): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.fullname === "string" &&
    typeof data.email === "string" &&
    typeof data.password === "string"
  );
}

async function getProfile(req: Request): Promise<ProfileData> {
  const { fullname, email, password } = req.body;
  if (isProfileData({ fullname, email, password })) {
    const hashedPass = await crypt.hash(password, 10); //TODO: en prod es 17 la cantodad de salt
    const hash = await sha3Hash(email);
    return {
      fullname,
      email,
      password: hashedPass,
      hash,
    };
  } else {
    throw new Error(INVALID_BODY_DATA);
  }
}

//TODO: Mejorar
function isCredentialsData(data: any): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.email === "string" &&
    typeof data.password === "string"
  );
}

async function getCredentials(req: Request): Promise<CredentialsData> {
  const { email, password } = req.body;
  if (isCredentialsData({ email, password })) {
    const hash = await sha3Hash(email);
    return { email, password, hash };
  } else {
    throw new Error(INVALID_LOGIN_CREDENTIALS);
  }
}

function getHeader(req: Request, name: string): string | undefined {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

function getToken(req: Request): string | undefined {
  const token = getHeader(req, ACCESS_TOKEN) ?? getHeader(req, AUTHORIZATION);
  if (typeof token === "string" && token.startsWith(BEARER)) {
    const sliced = token.slice(BEARER.length, token.length); // Remove Bearer from string
    return sliced;
  } else return undefined;
}

export async function checkToken(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const token = getToken(req);
    if (!token) {
      next(new HttpError(UNAUTHORIZED));
    } else {
      if (await verifyToken(token)) next();
      else next(new HttpError(UNAUTHORIZED));
    }
  } catch (error) {
    next(new HttpError(INTERNAL));
  }
}

//TODO: https://nodejs.org/api/errors.html#new-errormessage-options

function errorHandler(error: Error, next: NextFunction): void {
  switch (error.message) {
    case INVALID_BODY_DATA: //getProfile failed
    case INVALID_LOGIN_CREDENTIALS: //getCredentials failed
      next(new HttpError(BAD_REQUEST));
      break;
    case USER_PROFILE_EXISTS: //userProf.createProfile failed
      next(new HttpError(UNAUTHORIZED));
      break;
    case CANT_COMPARE_PASSWORD: //credentialsMatch failed
    case CANT_SIGN_JWT_TOKEN: //signToken failed
      next(new HttpError(INTERNAL));
      break;
    default:
      next(new HttpError(INTERNAL)); // No debería ocurrir, solo en caso de agregar codigo y no contemplar el mensaje de rror en el catch
      break;
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const profile = await getProfile(req);
    const userProf = new UserProfile(profile.hash);
    userProf.createProfile(profile);
    res.status(CREATED.status).send(CREATED.message);
  } catch (error) {
    if (error instanceof Error) errorHandler(error, next);
    else next(new HttpError(CONFLICT));
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const creds = await getCredentials(req);
    const userProf = new UserProfile(creds.hash);
    if (!userProf.profileExists){
      next(new HttpError(UNAUTHORIZED)); //El usuario no existe
      }
    else {
      if (await userProf.credentialsMatch(creds)) {
        const token = signToken(creds.hash);
        res.status(200).json(token);
      } else next(new HttpError(UNAUTHORIZED)); // Las credenciales no coinciden.
    }
  } catch (error) {
    if (error instanceof Error) errorHandler(error, next);
    else next(new HttpError(INTERNAL)); //Es un error desconocido.
  }
}
