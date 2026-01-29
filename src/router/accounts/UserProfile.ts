import fs from "fs";
import path from "path";
import crypt from "bcrypt";
import { CANT_COMPARE_PASSWORD, USER_PROFILE_EXISTS } from "./constants";
import { CredentialsData, ProfileData } from "./types";
import { ensureFolder, optionalEnv } from "../../commons";

const USERS_FOLDER = optionalEnv("USERS_FOLDER", path.resolve(".", "users"));

export class UserProfile {
  private readonly hash: string;

  constructor(hash: string) {
    this.hash = hash;
  }
  protected get userFolder(): string {
    return path.resolve(USERS_FOLDER, this.hash);
  }
  protected get userFile(): string {
    return path.resolve(USERS_FOLDER, this.hash, ".profile");
  }
  public get profileExists(): boolean {
    return fs.existsSync(this.userFile);
  }

  public createProfile(profile: ProfileData) {
    if (this.profileExists) throw new Error(USER_PROFILE_EXISTS);
    try {
      ensureFolder(this.userFolder);
      fs.writeFileSync(this.userFile, JSON.stringify(profile));
    } catch (error) {
      //TODO: mejorar segun tipo de error y considerar el UNKOWN como "nunca ocurriria pero..."
      if (error instanceof Error) {
        throw new Error(error.message);
      } else throw new Error("UNKOWN");
    }
  }
  
  public async credentialsMatch(creds: CredentialsData): Promise<boolean> {
    try {
      const profile = fs.readFileSync(this.userFile, "utf-8");
      const data = JSON.parse(profile) as CredentialsData;
      return await crypt.compare(creds.password, data.password);
    } catch (error) {
      throw new Error(CANT_COMPARE_PASSWORD);
    }
  }
}
