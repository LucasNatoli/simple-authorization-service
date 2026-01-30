import { NextFunction, Request, Response } from "express";
import {
    HttpError,
    BAD_REQUEST,
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

export function errorHandler(error: Error, next: NextFunction): void {
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

//TODO: https://nodejs.org/api/errors.html#new-errormessage-options
