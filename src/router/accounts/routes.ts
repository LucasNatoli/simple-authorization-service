import { NextFunction, Request, Response } from "express";
import { UserProfile } from "./UserProfile";
import { extractCredentials, extractProfile, extractToken } from "./parser";
import { errorHandler } from "./errorHandler";
import {
  signToken,
  verifyToken,
  HttpError,
  CONFLICT,
  CREATED,
  INTERNAL,
  UNAUTHORIZED,
} from "../../commons";

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
