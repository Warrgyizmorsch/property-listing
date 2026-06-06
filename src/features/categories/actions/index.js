"use server"

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { categoryFormSchema } from "../schemas";
import {
  createCategory,
  updateCategory,
  softDeleteCategory,
  restoreCategory
} from "../services";

/**
 * Server Action: Create Category.
 * Validates session, parses schema input, invokes DB creation, and triggers revalidation.
 */
export async function createCategoryAction(values) {
  try {
    // 1. Session Guard Check
    await requireAdmin();

    // 2. Validate input schema
    const validated = categoryFormSchema.safeParse(values);
    if (!validated.success) {
      const errorMessage = validated.error.errors.map(err => err.message).join(" ");
      return { success: false, error: errorMessage || "Invalid input data." };
    }

    // 3. Invoke Service mutation
    await createCategory(validated.data);

    // 4. Revalidate Listing Page
    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    console.error("Action error creating category:", error);
    return { success: false, error: error.message || "Something went wrong." };
  }
}

/**
 * Server Action: Update Category.
 */
export async function updateCategoryAction(id, values) {
  try {
    await requireAdmin();

    const validated = categoryFormSchema.safeParse(values);
    if (!validated.success) {
      const errorMessage = validated.error.errors.map(err => err.message).join(" ");
      return { success: false, error: errorMessage || "Invalid input data." };
    }

    await updateCategory(id, validated.data);

    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    console.error("Action error updating category:", error);
    return { success: false, error: error.message || "Something went wrong." };
  }
}

/**
 * Server Action: Soft Delete/Archive Category.
 */
export async function softDeleteCategoryAction(id) {
  try {
    await requireAdmin();

    if (!id) {
      return { success: false, error: "Category ID is required." };
    }

    await softDeleteCategory(id);

    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    console.error("Action error deleting category:", error);
    return { success: false, error: error.message || "Something went wrong." };
  }
}

/**
 * Server Action: Restore Soft-Deleted Category.
 */
export async function restoreCategoryAction(id) {
  try {
    await requireAdmin();

    if (!id) {
      return { success: false, error: "Category ID is required." };
    }

    await restoreCategory(id);

    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    console.error("Action error restoring category:", error);
    return { success: false, error: error.message || "Something went wrong." };
  }
}
