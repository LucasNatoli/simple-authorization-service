import { NextFunction, Request, Response } from "express";
import { UserProfile } from "./UserProfile";
import { extractCredentials, extractProfile, extractToken } from "./parser";
import {
  signToken,
  verifyToken,
  HttpError,
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  INTERNAL,
  UNAUTHORIZED,
  CANT_SIGN_JWT_TOKEN,
} from "../../commons";
import {
  CANT_COMPARE_PASSWORD,
  INVALID_BODY_DATA,
  INVALID_LOGIN_CREDENTIALS,
  USER_PROFILE_EXISTS,
} from "./constants";

export async function checkToken(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const token = extractToken(req);
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
    case INVALID_BODY_DATA: //extractProfile failed
    case INVALID_LOGIN_CREDENTIALS: //extractCredentials failed
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
    const profile = await extractProfile(req);
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
    const creds = await extractCredentials(req);
    const userProf = new UserProfile(creds.hash);
    if (!userProf.profileExists) {
      next(new HttpError(UNAUTHORIZED)); //El usuario no existe
    } else {
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
