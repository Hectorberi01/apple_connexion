import { getDataSource } from "@/app/lib/db/dataSource";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ds = await getDataSource();
    return NextResponse.json({
      status: "ok",
      connected: ds.isInitialized,
      entities: ds.entityMetadatas.map(e => e.tableName),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}