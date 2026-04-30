import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import {
  verifyAppleToken,
  signAccessToken,
  signRefreshToken,
} from "@/app/lib/auth/jwt";
import { UserRepository } from "@/app/lib/db/repositories/UserRepository";
import { getDataSource } from "@/app/lib/db/dataSource";
import { CreateAccountPayload } from "@/app/types/appleAuth";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST(req: NextRequest) {
  try {
    const body: CreateAccountPayload = await req.json();

    if (!body.appleUserId || !body.idToken) {
      return NextResponse.json(
        { message: "Données manquantes (appleUserId ou idToken)" },
        { status: 400 }
      );
    }

    // 1. Vérifier le id_token Apple via JWKS
    let applePayload;
    try {
      applePayload = await verifyAppleToken(body.idToken);
    } catch {
      return NextResponse.json(
        { message: "Token Apple invalide ou expiré" },
        { status: 401 }
      );
    }

    // 2. Vérifier cohérence appleUserId / sub
    if (applePayload.sub !== body.appleUserId) {
      return NextResponse.json(
        { message: "Incohérence entre appleUserId et le token" },
        { status: 401 }
      );
    }

    // 3. Upsert en base
    const ds = await getDataSource();
    const userRepo = new UserRepository(ds);

    const user = await userRepo.upsertAppleUser({
      ...body,
      isPrivateEmail: applePayload.is_private_email ?? body.isPrivateEmail,
    });

    // 4. Générer les tokens JWT de l'application
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: user.id, email: user.email }),
      signRefreshToken(user.id),
    ]);

    // 5. Réponse + cookie httpOnly pour le refreshToken
    const response = NextResponse.json({
      userId: user.id,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        isPrivateEmail: user.isPrivateEmail,
        createdAt: user.createdAt,
      },
    });

    response.cookies.set("refresh_token", refreshToken, {
      ...COOKIE_OPTS,
      maxAge: 60 * 60 * 24 * 30, // 30 jours
    });

    return response;
  } catch (err: unknown) {
    console.error("[POST /api/auth/apple]", err);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}