import { SignJWT, jwtVerify, createRemoteJWKSet, JWTPayload } from "jose";

const ACCESS_TOKEN_TTL = "1h";
const REFRESH_TOKEN_TTL = "30d";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET manquant dans les variables d'env");
  return new TextEncoder().encode(secret);
}

// ─── Apple id_token validation ──────────────────────────────────────────────

const APPLE_JWKS = createRemoteJWKSet(
  new URL("https://appleid.apple.com/auth/keys")
);

export interface AppleTokenClaims extends JWTPayload {
  email?: string;
  email_verified?: boolean;
  is_private_email?: boolean;
}

export async function verifyAppleToken(
  idToken: string
): Promise<AppleTokenClaims> {
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
  if (!clientId) throw new Error("NEXT_PUBLIC_APPLE_CLIENT_ID manquant");

  const { payload } = await jwtVerify(idToken, APPLE_JWKS, {
    issuer: "https://appleid.apple.com",
    audience: clientId,
  });

  return payload as AppleTokenClaims;
}

// ─── App JWT ─────────────────────────────────────────────────────────────────

export interface AppTokenPayload {
  userId: string;
  email: string | null;
}

export async function signAccessToken(data: AppTokenPayload): Promise<string> {
  return new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .setSubject(data.userId)
    .sign(getJwtSecret());
}

export async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .setSubject(userId)
    .sign(getJwtSecret());
}

export async function verifyAccessToken(
  token: string
): Promise<AppTokenPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return {
    userId: payload.sub as string,
    email: (payload.email as string | null) ?? null,
  };
}