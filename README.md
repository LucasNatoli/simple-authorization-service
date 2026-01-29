# simple-authorization-service

Un servicio de autorizacion muy simple. 

Permite registrar y autorizar usarios mediante credenciales email - password.


Es util para boilerplates y pruebas de concepto ya que puede agregarse como middleware a una aplicacion express.

````ts
import express, { Request, Response } from "express";
import { router } from "./router";

const app = express();

app.use(express.json()); 
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Listening.",
    timestamp: new Date().toISOString(),
  });
});

//Iniciar el router con la app express
router(app);
````
Permite personalizar algunos parametros del servicio. Copiar el archivo `env.sample` a `.dev.env` y/o `.prod.env` para personalizar parametros en entornos de desarrollo o produccion respectivamente.

````conf
REST_API_PORT = 8080
JWT_SECRET = 'REPLACE THIS WITH A VERY LONG SECRET'
LOG_TO_CONSOLE = false
USERS_FOLDER = /root/users
AUTH_DELAY=10000
````