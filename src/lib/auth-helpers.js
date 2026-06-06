import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Checks if a session belongs to an authorized admin.
 * @param {object} session - NextAuth session object.
 * @returns {boolean}
 */
export function isAdmin(session) {
  if (!session?.user) return false;
  return session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
}

/**
 * Checks if a session belongs to a Super Admin.
 * @param {object} session - NextAuth session object.
 * @returns {boolean}
 */
export function isSuperAdmin(session) {
  if (!session?.user) return false;
  return session.user.role === "SUPER_ADMIN";
}

/**
 * Server guard to enforce admin role verification on Server Components and Server Actions.
 * Redirects to login if unauthenticated, or throws an error if unauthorized.
 * @returns {Promise<object>} - Returns session object if verified.
 */
export async function requireAdmin() {
  const session = await auth();

  // 1. Check authentication
  if (!session?.user) {
    redirect("/admin/login");
  }

  // 2. Check administrator roles
  if (!isAdmin(session)) {
    redirect("/admin/login?error=UnauthorizedRole");
  }

  return session;
}

/**
 * Server guard to strictly enforce Super Admin verification.
 * @returns {Promise<object>} - Returns session object if verified.
 */
export async function requireSuperAdmin() {
  const session = await auth();

  // 1. Check authentication
  if (!session?.user) {
    redirect("/admin/login");
  }

  // 2. Enforce strict Super Admin role
  if (!isSuperAdmin(session)) {
    // If they are an ordinary admin, throw an inline error rather than redirecting to login loop
    throw new Error("Forbidden: Super Admin access required.");
  }

  return session;
}
