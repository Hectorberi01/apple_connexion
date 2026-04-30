export interface AppleAuthResponse {
  authorization: {
    code: string;
    id_token: string;
    state?: string;
  };
  user?: {
    email: string;
    name?: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface AppleIdTokenPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string; // Apple user ID (stable)
  email?: string;
  email_verified?: boolean;
  is_private_email?: boolean;
  nonce?: string;
  nonce_supported: boolean;
}

export type AppleAuthState = "idle" | "loading" | "success" | "error";

// Étendu pour le backend
export interface CreateAccountPayload {
  appleUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  idToken: string;
  isPrivateEmail?: boolean;
}