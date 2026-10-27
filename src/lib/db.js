import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis;

function getAdapterOptions(databaseUrl = process.env.DATABASE_URL || "mysql://root:@localhost:3306/property-listing") {
  try {
    const rawUrl = databaseUrl || "mysql://root:@localhost:3306/property-listing";
    const url = new URL(rawUrl);
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
      database: url.pathname.replace(/^\//, "") || "property-listing",
      connectionLimit: process.env.NODE_ENV === "production" ? 15 : 25,
      idleTimeout: 60,
      minDelayValidation: 500,
      acquireTimeout: 30000,
      connectTimeout: 15000,
      ...(requiresSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    };
  } catch (error) {
    console.error("Failed to parse DATABASE_URL environment variable:", error);
    return {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "property-listing",
      connectionLimit: 25,
      idleTimeout: 60,
      minDelayValidation: 500,
      acquireTimeout: 30000,
      connectTimeout: 15000,
    };
  }
}

// Lazy initialization of Prisma client to prevent build-time failures.
function getPrismaInstance() {
  if (!globalForPrisma.prisma) {
    try {
      const adapterOptions = getAdapterOptions(process.env.DATABASE_URL);
      if (!globalForPrisma.prismaAdapter) {
        globalForPrisma.prismaAdapter = new PrismaMariaDb(adapterOptions);
      }
      globalForPrisma.prisma = new PrismaClient({
        adapter: globalForPrisma.prismaAdapter,
        log:
          process.env.NODE_ENV === "production" ? ["error"] : ["error"],
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
