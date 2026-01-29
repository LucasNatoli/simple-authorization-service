import fs from "node:fs";

/**
 * Verifica si existe la carpeta `folder` y en caso negativo la crea.
 *
 * @export
 * @param {string} folder
 */
export function ensureFolder(folder: string) {
  try {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  } catch (error) {
    throw new Error("Folder doesn't exist.");
  }
}

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

/**
 * Devuelve el valor de una variable de entorno. Si no está declarada, devuelve el valor `fallback`.
 *
 * @export
 * @template {string | number | boolean} T
 * @param {string} name nombre de la variable de entorno.
 * @param {T} fallback Valor por defecto.
 * @returns {T} Devuelve el mismo tipo que `fallback`
 */
export function optionalEnv<T extends string | number | boolean>(
  name: string,
  fallback: T
): T;
export function optionalEnv(name: string, fallback: number): number;
export function optionalEnv(name: string, fallback: string): string;
export function optionalEnv(name: string, fallback: boolean): boolean;
export function optionalEnv(name: string, fallback: number | string | boolean) {
  const value = process.env[name];

  if (value == null) return fallback;

  if (typeof fallback === "number") {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  if (typeof fallback === "boolean") {
    return value === "true";
  }

  return value;
}
