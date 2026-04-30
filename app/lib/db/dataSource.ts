import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

declare global {
  var _typeormDataSource: DataSource | undefined;
}

function createDataSource(): DataSource {
  const url = process.env.DATABASE_URL;
  console.log("[TypeORM] DATABASE_URL:", url ? "✓ défini" : "✗ MANQUANT");

  return new DataSource({
    type: "postgres",
    host: "193.168.145.162",
    port: 5432,
    username: "postgres",
    password: "Hba@Str0ng#2026",
    database: "Apple_connect",
    ssl: false,
    entities: [User],
    synchronize: true, 
    logging: true,
  });
}

export async function getDataSource(): Promise<DataSource> {
  if (!global._typeormDataSource) {
    global._typeormDataSource = createDataSource();
  }

  if (!global._typeormDataSource.isInitialized) {
    console.log("[TypeORM] Initialisation de la connexion...");
    await global._typeormDataSource.initialize();
    console.log("[TypeORM] Connexion établie ✓");
  }

  return global._typeormDataSource;
}