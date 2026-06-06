"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import {
  updateEnquiryStatus,
  updateEnquiryNotes,
} from "../services/enquiry.service";
import {
  enquiryStatusSchema,
  enquiryNotesSchema,
} from "../schemas/enquiry.schema";

/**
 * Action: Update status of an enquiry.
 */
export async function updateEnquiryStatusAction(id, status) {
  try {
    await requireAdmin();

    if (!id) {
      return { success: false, error: "Enquiry ID is required." };
    }

    const validated = enquiryStatusSchema.safeParse({ status });
    if (!validated.success) {
      const msg = validated.error.errors.map((e) => e.message).join(" ");
      return { success: false, error: msg || "Invalid status provided." };
    }

    await updateEnquiryStatus(id, validated.data.status);

    revalidatePath("/admin/enquiries");
    revalidatePath(`/admin/enquiries/${id}`);
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Action error updating enquiry status:", error);
    return {
      success: false,
      error: error.message || "Failed to update enquiry status.",
    };
  }
}

/**
 * Action: Update internal notes of an enquiry.
 */
export async function updateEnquiryNotesAction(id, notes) {
  try {
    await requireAdmin();

    if (!id) {
      return { success: false, error: "Enquiry ID is required." };
    }

    const validated = enquiryNotesSchema.safeParse({ notes });
    if (!validated.success) {
      const msg = validated.error.errors.map((e) => e.message).join(" ");
      return { success: false, error: msg || "Invalid notes data." };
    }

    await updateEnquiryNotes(id, validated.data.notes);

    revalidatePath(`/admin/enquiries/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Action error updating enquiry notes:", error);
    return {
      success: false,
      error: error.message || "Failed to update internal notes.",
    };
  }
}
