"use client";

import { AppleSignUpButton } from "./components/AppleSignUpButton";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Créer un compte
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Rejoignez-nous en quelques secondes.
        </p>
        <AppleSignUpButton
          onSuccess={(userId, token) => console.log("Compte créé :", userId, token)}
          onError={(msg) => console.error("Erreur :", msg)}
        />
      </div>
    </main>
  );
}