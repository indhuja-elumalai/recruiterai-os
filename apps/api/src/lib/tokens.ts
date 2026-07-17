import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { env } from "../config/env.js";
import { HttpError } from "./http-error.js";

const encoder = new TextEncoder();
const ISSUER = "recruiterai-api";
const AUDIENCE = "recruiterai-web";

interface TokenClaims extends JWTPayload {
  role: string;
  tokenVersion: number;
  type: "access" | "refresh";
}

function secret(value: string | undefined, name: string): Uint8Array {
  if (!value) throw new Error(`${name} is required for authentication`);
  return encoder.encode(value);
}

async function signToken(
  userId: string,
  role: string,
  tokenVersion: number,
  type: "access" | "refresh",
): Promise<string> {
  const isAccess = type === "access";
  return new SignJWT({ role, tokenVersion, type })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(isAccess ? env.ACCESS_TOKEN_TTL : env.REFRESH_TOKEN_TTL)
    .sign(
      secret(
        isAccess ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET,
        isAccess ? "JWT_ACCESS_SECRET" : "JWT_REFRESH_SECRET",
      ),
    );
}

export const createAccessToken = (userId: string, role: string, tokenVersion: number) =>
  signToken(userId, role, tokenVersion, "access");

export const createRefreshToken = (userId: string, role: string, tokenVersion: number) =>
  signToken(userId, role, tokenVersion, "refresh");

export async function verifyToken(token: string, type: "access" | "refresh"): Promise<TokenClaims> {
  try {
    const { payload } = await jwtVerify(
      token,
      secret(
        type === "access" ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET,
        type === "access" ? "JWT_ACCESS_SECRET" : "JWT_REFRESH_SECRET",
      ),
      { issuer: ISSUER, audience: AUDIENCE },
    );

    if (payload.type !== type || !payload.sub) throw new Error("Unexpected token claims");
    return payload as TokenClaims;
  } catch {
    throw new HttpError(401, "INVALID_TOKEN", "Your session is invalid or has expired");
  }
}
