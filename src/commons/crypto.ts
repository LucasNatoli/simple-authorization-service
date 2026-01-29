import jwt from "jsonwebtoken";
import { requiredEnv } from "./config";
import { CANT_SIGN_JWT_TOKEN } from "../router/accounts";

export function signToken(hash: string) {
  try {
    const secret = requiredEnv("JWT_SECRET");
    let token = jwt.sign({ id: hash }, secret, { expiresIn: "24h" });
    return {
      token,
    };
  } catch (error) {
    throw new Error(CANT_SIGN_JWT_TOKEN);
  }
}
export async function verifyToken(token: string): Promise<Boolean> {
  return new Promise((resolve, reject) => {
    const secret = requiredEnv("JWT_SECRET");
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(false);
      else {
        console.log(decoded);
        resolve(true);
      }
    });
  });
}
