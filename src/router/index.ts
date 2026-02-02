import { Express } from "express";
import { checkToken, register, login } from "./accounts";
import { httpErrorHandler } from "../middleware";
/**
 * Agregar las rutas de manejo de usuarios
 *
 * @export
 * @param {Express} app
 */
export function router(app: Express) {
  app.post("/register", register);
  app.post("/login", login);
  app.get("/check", checkToken, (_req, res, _next) => { res.status(200).send() })
  app.use(httpErrorHandler);
}
