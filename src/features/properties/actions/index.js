"use server"

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { propertyFormSchema } from "../schemas";
import {
  createProperty,
  updateProperty,
  softDeleteProperty,
  restoreProperty,
  togglePropertyFeatured,
  changePropertyStatus,
  getPropertyFormMetadata
} from "../services";

/**
 * Action: Retrieve dropdown selection values.
 */
export async function getPropertyFormMetadataAction() {
  try {
    await requireAdmin();
    return await getPropertyFormMetadata();
  } catch (error) {
    console.error("Error retrieving property form metadata:", error);
    return { categories: [], purposes: [], statuses: [], countries: [] };
  }
}

/**
 * Action: Create a Property.
 */
export async function createPropertyAction(values) {
  try {
    const session = await requireAdmin();

    const validated = propertyFormSchema.safeParse(values);
    if (!validated.success) {
      const msg = validated.error.errors.map((e) => e.message).join(" ");
      return { success: false, error: msg || "Invalid property details." };
    }

    await createProperty(validated.data, session.user.id);
    
    revalidatePath("/admin/properties");
    revalidatePath("/admin/dashboard"); // Revalidate dashboard statistics counts
    
    return { success: true };
  } catch (error) {
    console.error("Action error creating property:", error);
    return { success: false, error: error.message || "Failed to create property." };
  }
}

/**
 * Action: Update a Property.
 */
export async function updatePropertyAction(id, values) {
  try {
    await requireAdmin();

    if (!id) return { success: false, error: "Property ID is required." };

    const validated = propertyFormSchema.safeParse(values);
    if (!validated.success) {
      const msg = validated.error.errors.map((e) => e.message).join(" ");
      return { success: false, error: msg || "Invalid property details." };
    }

    await updateProperty(id, validated.data);
    
    revalidatePath("/admin/properties");
    
    return { success: true };
  } catch (error) {
    console.error("Action error updating property:", error);
    return { success: false, error: error.message || "Failed to update property." };
  }
}

/**
 * Action: Soft delete property.
 */
export async function softDeletePropertyAction(id) {
  try {
    await requireAdmin();

    if (!id) return { success: false, error: "Property ID is required." };

    await softDeleteProperty(id);
    
    revalidatePath("/admin/properties");
    revalidatePath("/admin/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Action error deleting property:", error);
    return { success: false, error: error.message || "Failed to delete property." };
  }
}

/**
 * Action: Restore archived property.
 */
export async function restorePropertyAction(id) {
  try {
    await requireAdmin();

    if (!id) return { success: false, error: "Property ID is required." };

    await restoreProperty(id);
    
    revalidatePath("/admin/properties");
    revalidatePath("/admin/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Action error restoring property:", error);
    return { success: false, error: error.message || "Failed to restore property." };
  }
}

/**
 * Action: Toggle isFeatured state.
 */
export async function togglePropertyFeaturedAction(id) {
  try {
    await requireAdmin();

    if (!id) return { success: false, error: "Property ID is required." };

    await togglePropertyFeatured(id);
    
    revalidatePath("/admin/properties");
    
    return { success: true };
  } catch (error) {
    console.error("Action error toggling featured state:", error);
    return { success: false, error: error.message || "Failed to toggle featured state." };
  }
}

/**
 * Action: Change property status inline.
 */
export async function changePropertyStatusAction(id, statusId) {
  try {
    await requireAdmin();

    if (!id || !statusId) {
      return { success: false, error: "Property ID and Status ID are required." };
    }

    await changePropertyStatus(id, statusId);
    
    revalidatePath("/admin/properties");
    revalidatePath("/admin/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Action error changing property status:", error);
    return { success: false, error: error.message || "Failed to change property status." };
  }
}
