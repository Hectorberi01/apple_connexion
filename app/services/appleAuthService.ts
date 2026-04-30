import {
  AppleAuthResponse,
  AppleIdTokenPayload,
  CreateAccountPayload,
} from "../types/appleAuth";

function decodeJwtPayload<T>(token: string): T {
  const base64 = token
    .split(".")[1]
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const json = atob(base64);
  return JSON.parse(json) as T;
}

export function extractPayload(
  response: AppleAuthResponse
): CreateAccountPayload {
  const payload = decodeJwtPayload<AppleIdTokenPayload>(
    response.authorization.id_token
  );

  return {
    appleUserId: payload.sub,
    email: payload.email ?? response.user?.email ?? null,
    firstName: response.user?.name?.firstName ?? null,
    lastName: response.user?.name?.lastName ?? null,
    idToken: response.authorization.id_token,
  };
}

export async function registerWithApple(
  data: CreateAccountPayload
): Promise<{ userId: string; accessToken: string }> {
  const res = await fetch("/api/auth/apple", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Apple sign-up failed");
  }

  return res.json();
}