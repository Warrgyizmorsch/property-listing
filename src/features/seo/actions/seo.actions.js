"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { seoSettingSchema } from "../schemas/seo.schema";
import { upsertSeoSetting } from "../services/seo.service";

/**
 * Action: Save SEO Setting for a specific page type.
 */
export async function saveSeoSettingAction(pageType, values) {
  try {
    await requireAdmin();

    const validated = seoSettingSchema.safeParse(values);
    if (!validated.success) {
      const msg = validated.error.errors.map((e) => e.message).join(" ");
      return { success: false, error: msg || "Invalid SEO configuration." };
    }

    const result = await upsertSeoSetting(pageType, null, validated.data);

    // Revalidate paths based on the modified pageType
    if (pageType === "HOME") {
      revalidatePath("/");
    } else if (pageType === "PROPERTY_LISTING") {
      revalidatePath("/properties");
    }

    // Always revalidate the admin path to update the view
    revalidatePath("/admin/seo");

    // Return plain JSON object
    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error) {
    console.error("Action error saving SEO setting:", error);
    return { success: false, error: error.message || "Failed to save SEO settings." };
  }
}
