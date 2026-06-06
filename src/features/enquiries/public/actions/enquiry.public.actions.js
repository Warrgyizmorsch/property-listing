"use server"

import { db } from "@/lib/db";
import { createEnquirySchema } from "@/features/enquiries/schemas/enquiry.schema";
import { sendAdminEnquiryNotification } from "@/lib/mail";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * Handles public submissions for property enquiries.
 * Implements: Zod Validation, Honeypot checks, Cookie-based Rate Limiting,
 * database persistence, Resend notifications, and path revalidations.
 */
export async function createPublicEnquiryAction(data) {
  try {
    // 1. Honeypot check (automated bots populate hidden inputs)
    if (data.website) {
      return { error: "Spam submission detected and blocked." };
    }

    // 2. Rate Limiting Check (60 seconds throttle per browser)
    const cookieStore = await cookies();
    const lastSubmission = cookieStore.get("last_enquiry_submission")?.value;
    if (lastSubmission) {
      const diff = Date.now() - parseInt(lastSubmission, 10);
      if (diff < 60000) {
        const remainingSeconds = Math.ceil((60000 - diff) / 1000);
        return {
          error: `You are submitting enquiries too fast. Please wait ${remainingSeconds} seconds before trying again.`,
        };
      }
    }

    // 3. Zod Schema Validation
    const validated = createEnquirySchema.safeParse({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      propertyId: data.propertyId,
    });

    if (!validated.success) {
      // Extract the first validation failure message
      const fieldErrors = validated.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)[0]?.[0];
      return { error: firstError || "Validation failed on submitted fields." };
    }

    const { name, email, phone, message, propertyId } = validated.data;

    // 4. Resolve Property Context & Slug for revalidation tasks
    const property = await db.property.findFirst({
      where: { id: propertyId, deletedAt: null },
      select: { title: true, slug: true },
    });

    if (!property) {
      return { error: "The selected property listing could not be found." };
    }

    // 5. Database Save (Defaults status to NEW)
    await db.enquiry.create({
      data: {
        name,
        email,
        phone,
        message,
        propertyId,
        status: "NEW",
      },
    });

    // 6. Set Rate Limit Cookie
    cookieStore.set("last_enquiry_submission", Date.now().toString(), {
      maxAge: 60, // 60 seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // 7. Dispatch Admin Email Notification via Resend (Fails Gracefully)
    try {
      await sendAdminEnquiryNotification({
        propertyTitle: property.title,
        name,
        email,
        phone,
        message,
      });
    } catch (mailError) {
      console.error("Mailing failure caught gracefully during enquiry persist tasks:", mailError);
    }

    // 8. Revalidate cached routes to reflect dynamic numbers instantly
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/enquiries");
    revalidatePath(`/properties/${property.slug}`);

    return { success: true };
  } catch (error) {
    console.error("Enquiry Server Action error:", error);
    return {
      error: "An unexpected database error occurred while registering your enquiry. Please try again later.",
    };
  }
}
