"use client";

import { useAppleSignUp } from "../hooks/useAppleSignUp";

interface Props {
  onSuccess?: (userId: string, token: string) => void;
  onError?: (msg: string) => void;
}

export function AppleSignUpButton({ onSuccess, onError }: Props) {
  const { signUp, isLoading, error } = useAppleSignUp();

  const handleClick = async () => {
    console.log("🔘 handleClick appelé");
    const result = await signUp();
    if (result) {
      onSuccess?.(result.userId, result.accessToken);
    } else if (error) {
      onError?.(error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      aria-label="Créer un compte avec Apple"
      className={[
        "flex items-center justify-center gap-2.5",
        "w-full px-5 py-3 rounded-lg",
        "bg-black text-white text-[15px] font-medium",
        "transition-opacity duration-150",
        isLoading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 cursor-pointer",
      ].join(" ")}
    >
      <svg width="18" height="18" viewBox="0 0 814 1000" aria-hidden="true">
        <path
          fill="white"
          d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5
             0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7
             71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5
             123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9
             40.8s-105-57.8-155.5-127.4C46 376.8 1 246.8 1
             121.4c0-113.4 74.8-173.4 147.1-173.4
             70.6 0 114.6 47.4 165.5 47.4 49 0 100.1-50.7
             168.2-50.7 56.9 0 119.6 32.8 160.5 92.2zm-180.5
             -81.9c28.1-36.1 48.4-86.2 48.4-136.3 0-6.9-.6-13.9-1.9-19.4
             -45.9 1.7-99.3 30.7-132.5 72-26.8 31.4-51.1 81-51.1
             131.8 0 7.6 1.3 15.2 1.9 17.5 2.9.6 7.6 1.3 12.2
             1.3 41.2 0 90.3-27.5 123-67z"
        />
      </svg>
      {isLoading ? "Connexion..." : "Continuer avec Apple"}
    </button>
  );
}