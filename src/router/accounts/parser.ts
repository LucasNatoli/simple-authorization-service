import { sha3Hash, ACCESS_TOKEN, BEARER, AUTHORIZATION } from "../../commons";

import { Request } from "express";
import { CredentialsData, ProfileData } from "./types";
import { INVALID_BODY_DATA, INVALID_LOGIN_CREDENTIALS } from "./constants";
//TODO: Mudar a crypto
import crypt from "bcrypt";

//TODO: Mejorar
function isCredentialsData(data: any): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.email === "string" &&
    typeof data.password === "string"
  );
}

//TODO: Mejorar
function isProfileData(data: any): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.fullname === "string" &&
    typeof data.email === "string" &&
    typeof data.password === "string"
  );
}

function getHeader(req: Request, name: string): string | undefined {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

export async function extractCredentials(req: Request): Promise<CredentialsData> {
  const { email, password } = req.body;
  if (isCredentialsData({ email, password })) {
    const hash = await sha3Hash(email);
    return { email, password, hash };
  } else {
    throw new Error(INVALID_LOGIN_CREDENTIALS);
  }
}

export async function extractProfile(req: Request): Promise<ProfileData> {
  const { fullname, email, password } = req.body;
  if (isProfileData({ fullname, email, password })) {
    const hashedPass = await crypt.hash(password, 10); //TODO: en prod es 17 la cantodad de salt
    const hash = await sha3Hash(email);
    return {
      fullname,
      email,
      password: hashedPass,
      hash,
    };
  } else {
    throw new Error(INVALID_BODY_DATA);
  }
}

export function extractToken(req: Request): string | undefined {
  const token = getHeader(req, ACCESS_TOKEN) ?? getHeader(req, AUTHORIZATION);
  if (typeof token === "string" && token.startsWith(BEARER)) {
    const sliced = token.slice(BEARER.length, token.length); // Remove Bearer from string
    return sliced;
  } else return undefined;
}
