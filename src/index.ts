import express, { Request, Response } from "express";
import { optionalEnv } from "./commons";
import { router } from "./router";
import { httpErrorHandler } from "./middleware";

const PORT = optionalEnv("REST_API_PORT", 3000);
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the TypeScript Express API!",
    timestamp: new Date().toISOString(),
  });
});
router(app);
app.use(httpErrorHandler);
app.listen(PORT, () => {
  console.log(`🚀 REST API escuchando en: http://localhost:${PORT}`);
});
