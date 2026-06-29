"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Handles newsletter subscription from the footer.
 * Saves the subscription as an enquiry record with a "Newsletter Subscription" message.
 * Implements cookie-based rate limiting to prevent spam.
 */
export async function subscribeNewsletterAction(email) {
  try {
    // 1. Basic email validation
    if (!email || typeof email !== "string") {
      return { error: "Please enter your email address." };
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Simple regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { error: "Please enter a valid email address." };
    }

    // 2. Rate Limiting (30 seconds throttle)
    const cookieStore = await cookies();
    const lastSub = cookieStore.get("last_newsletter_sub")?.value;
    if (lastSub) {
      const diff = Date.now() - parseInt(lastSub, 10);
      if (diff < 30000) {
        const remaining = Math.ceil((30000 - diff) / 1000);
        return {
          error: `Please wait ${remaining} seconds before subscribing again.`,
        };
      }
    }

    // 3. Check for duplicate subscription (same email with newsletter message)
    const existingSub = await db.enquiry.findFirst({
      where: {
        email: trimmedEmail,
        message: { contains: "Newsletter Subscription" },
        deletedAt: null,
      },
      select: { id: true },
    });

    if (existingSub) {
      return { error: "This email is already subscribed to our newsletter." };
    }

    // 4. Save to Enquiry table
    await db.enquiry.create({
      data: {
        name: "Newsletter Subscriber",
        email: trimmedEmail,
        phone: "N/A",
        message: "Newsletter Subscription — Subscribed via website footer.",
        status: "NEW",
        propertyId: null,
        projectId: null,
      },
    });

    // 5. Set Rate Limit Cookie
    cookieStore.set("last_newsletter_sub", Date.now().toString(), {
      maxAge: 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // 6. Revalidate admin pages
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/enquiries");

    return { success: true };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      error:
        "Something went wrong while subscribing. Please try again later.",
    };
  }
}
