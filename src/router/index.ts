import { Express, NextFunction, Request, Response } from "express";
import { checkToken, register, login, BASE_URL } from "./accounts";

/**
 * Agregar las rutas de manejo de usuarios
 *
 * @export
 * @param {Express} app
 */
export function router(app: Express) {
/*   app.get(
    BASE_URL + "/check",
    checkToken,
    (_req: Request, res: Response, _next: NextFunction) => {
      res.status(200).send();
    }
  ); */
  app.post( "/register", register);
  app.post( "/login", login);
  app.get("/check", checkToken, (_req, res, _next)=>{res.status(200).send()})
}
