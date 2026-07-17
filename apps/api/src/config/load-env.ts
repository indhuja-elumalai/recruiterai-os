import { existsSync } from "node:fs";
import path from "node:path";
import { config } from "dotenv";

type Exists = (filePath: string) => boolean;

export function resolveEnvPath(
  cwd = process.cwd(),
  exists: Exists = existsSync,
): string | undefined {
  const candidates = [path.resolve(cwd, ".env"), path.resolve(cwd, "../../.env")];
  return candidates.find((candidate) => exists(candidate));
}

export function loadEnvironment(): void {
  if (process.env.NODE_ENV === "test") return;
  const envPath = resolveEnvPath();
  if (envPath) config({ path: envPath, quiet: true });
}
