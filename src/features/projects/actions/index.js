"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { projectFormSchema } from "../schemas";
import {
  createProject,
  updateProject,
  softDeleteProject,
  restoreProject,
  getProjectFormMetadata,
} from "../services";

/**
 * Action: Retrieve dropdown selection values.
 */
export async function getProjectFormMetadataAction() {
  try {
    await requireAdmin();
    return await getProjectFormMetadata();
  } catch (error) {
    console.error("Error retrieving project form metadata:", error);
    return { categories: [], countries: [], projects: [] };
  }
}

/**
 * Action: Create a Project.
 */
export async function createProjectAction(values) {
  try {
    const session = await requireAdmin();

    const validated = projectFormSchema.safeParse(values);
    if (!validated.success) {
      const msg = validated.error.errors.map((e) => e.message).join(" ");
      return { success: false, error: msg || "Invalid project details." };
    }

    await createProject(validated.data, session.user.id);

    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Action error creating project:", error);
    return { success: false, error: error.message || "Failed to create project." };
  }
}

/**
 * Action: Update a Project.
 */
export async function updateProjectAction(id, values) {
  try {
    await requireAdmin();

    if (!id) return { success: false, error: "Project ID is required." };

    const validated = projectFormSchema.safeParse(values);
    if (!validated.success) {
      const msg = validated.error.errors.map((e) => e.message).join(" ");
      return { success: false, error: msg || "Invalid project details." };
    }

    await updateProject(id, validated.data);

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Action error updating project:", error);
    return { success: false, error: error.message || "Failed to update project." };
  }
}

/**
 * Action: Soft delete a project.
 */
export async function softDeleteProjectAction(id) {
  try {
    await requireAdmin();

    if (!id) return { success: false, error: "Project ID is required." };

    await softDeleteProject(id);

    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Action error deleting project:", error);
    return { success: false, error: error.message || "Failed to delete project." };
  }
}

/**
 * Action: Restore an archived project.
 */
export async function restoreProjectAction(id) {
  try {
    await requireAdmin();

    if (!id) return { success: false, error: "Project ID is required." };

    await restoreProject(id);

    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Action error restoring project:", error);
    return { success: false, error: error.message || "Failed to restore project." };
  }
}
