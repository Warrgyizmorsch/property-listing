import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis;

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

// Lazy initialization of Prisma client to prevent build-time failures
function getPrismaInstance() {
  if (!globalForPrisma.prisma) {
    try {
      const adapterOptions = getAdapterOptions(process.env.DATABASE_URL);
      const adapter = new PrismaMariaDb(adapterOptions);
      globalForPrisma.prisma = new PrismaClient({
        adapter,
        log:
          process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
      });
    } catch (error) {
      console.error("Failed to initialize Prisma:", error);
      throw error;
    }
  }
  return globalForPrisma.prisma;
}

export const db = new Proxy(
  {},
  {
    get(target, prop) {
      return getPrismaInstance()[prop];
    },
  },
);
