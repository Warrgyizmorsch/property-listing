'use server';

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { loginSchema } from "@/lib/validation";

/**
 * Handles administrator credential sign-in on the server side.
 * @param {object} data - Form payload containing email and password.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function loginUser(data) {
  try {
    // 1. Structural schema verification using Zod
    const validatedFields = loginSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, error: "Invalid inputs. Please check your credentials." };
    }

    const { email, password } = validatedFields.data;

    // 2. Trigger NextAuth credentials verification process
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirect: false, // Prevent throwing Next.js redirect errors in the try-catch block
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return { success: false, error: "Invalid email or password." };
        default:
          return { success: false, error: "Authentication system error. Please try again." };
      }
    }
    
    // Fallback error logging/handling
    return { success: false, error: "Invalid email or password." };
  }
}

/**
 * Handles administrator session logout, terminating the JWT token.
 */
export async function logoutUser() {
  await signOut({ redirectTo: "/admin/login" });
}
