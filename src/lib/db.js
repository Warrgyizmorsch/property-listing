import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis;

function getAdapterOptions(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    const params = new URLSearchParams(url.search);
    const sslMode =
      params.get("ssl") || params.get("sslmode") || params.get("useSSL");
    const requiresSsl = [
      "true",
      "1",
      "require",
      "required",
      "preferred",
      "enabled",
    ].includes((sslMode || "").toLowerCase());

    return {
      host: url.hostname || "localhost",
      port: parseInt(url.port || "3306", 10),
      user: decodeURIComponent(url.username || "root"),
      password: decodeURIComponent(url.password || ""),
      database: url.pathname.replace(/^\//, "") || "property_listing_db",
      connectTimeout: 10000,
      connectionLimit: 3,
      ...(requiresSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    };
  } catch (error) {
    console.error("Failed to parse DATABASE_URL environment variable:", error);
    return {};
  }
}

// Lazy initialization of Prisma client to prevent build-time failures.
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
    get(_target, prop) {
      const prisma = getPrismaInstance();
      const value = prisma[prop];
      return typeof value === "function" ? value.bind(prisma) : value;
    },
  },
);
