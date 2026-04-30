"use client";

import { useState, useCallback } from "react";
import { AppleAuthResponse, AppleAuthState } from "../types/appleAuth";
import { extractPayload, registerWithApple } from "../services/appleAuthService";

interface AppleAuthInitConfig {
  clientId: string;
  scope: string;
  redirectURI: string;
  usePopup: boolean;
}

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init(config: AppleAuthInitConfig): void;
        signIn(): Promise<AppleAuthResponse>;
      };
    };
  }
}

export function useAppleSignUp() {
  const [state, setState] = useState<AppleAuthState>("idle");
  const [error, setError] = useState<string | null>(null);

  const signUp = useCallback(async () => {
    console.log("🍎 signUp appelé");
    console.log("AppleID disponible:", !!window.AppleID);
    setState("loading");
    setError(null);

    try {
      window.AppleID?.auth.init({
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
        scope: "name email",
        redirectURI: "https://unstormy-lorriane-poikiloblastic.ngrok-free.dev",
        usePopup: true,
      });

      const response = await window.AppleID!.auth.signIn();
      const payload = extractPayload(response);
      const account = await registerWithApple(payload);

      setState("success");
      return account;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(msg);
      setState("error");
      return null;
    }
  }, []);

  return { signUp, state, error, isLoading: state === "loading" };
}