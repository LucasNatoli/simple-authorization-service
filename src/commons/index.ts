import { SHA3 } from "sha3";

export const VALID_EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function sha3Hash(message: string) {
  const hash = new SHA3(512);
  hash.update(message);
  return hash.digest("hex");
}
export const sleep = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));
export { Logger } from "./Loger";
export { requiredEnv, optionalEnv, ensureFolder } from "./config";
export * from "./http";
export {signToken, verifyToken} from "./crypto";