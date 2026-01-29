import { Request, Response, NextFunction } from "express";
import {
  CONFLICT,
  FORBIDDEN,
  UNPROCESSABLE,
  Logger,
  HttpError,
  UNAUTHORIZED,
  sleep,
  optionalEnv,
} from "../commons";

export async function httpErrorHandler(
  error: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const logtoconsole = optionalEnv("LOG_TO_CONSOLE", false);
  const { status, message } = { ...error };
  const proc = `${req.method} ${req.originalUrl} ${status} ${req.ip}`;
  const response = { success: false, message };
  const logger = new Logger("http");
  switch (status) {
    case UNAUTHORIZED.status:
    case UNPROCESSABLE.status:
      logger.warn(proc, message);
      await sleep(optionalEnv("AUTH_DELAY", 3000));
      res.status(status).json(response);
      break;
    case CONFLICT.status:
      logger.warn(proc, message);
      res.status(status).json(response);
      break;
    case FORBIDDEN.status:
      logger.warn(proc, message);
      res.status(status).json(response);
      break;
    default:
      logger.error(proc, message);
      res.status(status).json(response);
      break;
  }
  if (logtoconsole) console.error(proc, message);
}
