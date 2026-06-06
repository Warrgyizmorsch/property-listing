import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis;

let prismaInstance;

// Helper to parse the MySQL database URL and return credentials for the driver adapter
function getAdapterOptions(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    return {
      host: url.hostname || "localhost",
      port: parseInt(url.port || "3306", 10),
      user: url.username || "root",
      password: decodeURIComponent(url.password || ""),
      database: url.pathname.replace(/^\//, "") || "property_listing_db",
    };
  } catch (error) {
    console.error("Failed to parse DATABASE_URL environment variable:", error);
    // Return empty defaults to fail gracefully at connection time
    return {};
  }
}

if (process.env.NODE_ENV === "production") {
  const adapterOptions = getAdapterOptions(process.env.DATABASE_URL);
  const adapter = new PrismaMariaDb(adapterOptions);
  prismaInstance = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    const adapterOptions = getAdapterOptions(process.env.DATABASE_URL);
    const adapter = new PrismaMariaDb(adapterOptions);
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["error", "warn"],
    });
  }
  prismaInstance = globalForPrisma.prisma;
}

export const db = prismaInstance;
