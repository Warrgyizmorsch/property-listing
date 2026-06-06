"use server"

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import {
  countryFormSchema,
  stateFormSchema,
  cityFormSchema
} from "../schemas";
import {
  createCountry,
  updateCountry,
  softDeleteCountry,
  restoreCountry,
  createState,
  updateState,
  softDeleteState,
  restoreState,
  createCity,
  updateCity,
  softDeleteCity,
  restoreCity
} from "../services";

// ==========================================
// 1. HELPERS FOR FORM OPTIONS (UNAUTHENTICATED OPTION RETRIEVAL IS OKAY BUT SECURING FOR ADMIN EDIT ONLY IS BETTER)
// ==========================================

export async function getActiveCountriesAction() {
  try {
    await requireAdmin();
    return await db.country.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error loading active countries:", error);
    return [];
  }
}

export async function getActiveStatesAction(countryId) {
  try {
    await requireAdmin();
    if (!countryId) return [];
    
    return await db.state.findMany({
      where: { countryId, deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error loading active states:", error);
    return [];
  }
}

export async function getActiveCitiesAction(stateId) {
  try {
    await requireAdmin();
    if (!stateId) return [];
    
    return await db.city.findMany({
      where: { stateId, deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error loading active cities:", error);
    return [];
  }
}

// ==========================================
// 2. COUNTRY ACTIONS
// ==========================================

export async function createCountryAction(values) {
  try {
    await requireAdmin();
    const validated = countryFormSchema.safeParse(values);
    if (!validated.success) {
      const msg = validated.error.errors.map(e => e.message).join(" ");
      return { success: false, error: msg || "Invalid input." };
    }

    await createCountry(validated.data);
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to create country." };
  }
}

export async function updateCountryAction(id, values) {
  try {
    await requireAdmin();
    const validated = countryFormSchema.safeParse(values);
    if (!validated.success) {
      const msg = validated.error.errors.map(e => e.message).join(" ");
      return { success: false, error: msg || "Invalid input." };
    }

    await updateCountry(id, validated.data);
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to update country." };
  }
}

export async function softDeleteCountryAction(id) {
  try {
    await requireAdmin();
    if (!id) return { success: false, error: "ID is required." };

    await softDeleteCountry(id);
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to delete country." };
  }
}

export async function restoreCountryAction(id) {
  try {
    await requireAdmin();
    if (!id) return { success: false, error: "ID is required." };

    await restoreCountry(id);
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to restore country." };
  }
}

// ==========================================
// 3. STATE ACTIONS
// ==========================================

export async function createStateAction(values) {
  try {
    await requireAdmin();
    const validated = stateFormSchema.safeParse(values);
    if (!validated.success) {
      const msg = validated.error.errors.map(e => e.message).join(" ");
      return { success: false, error: msg || "Invalid input." };
    }

    await createState(validated.data);
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to create state." };
  }
}

export async function updateStateAction(id, values) {
  try {
    await requireAdmin();
    const validated = stateFormSchema.safeParse(values);
    if (!validated.success) {
      const msg = validated.error.errors.map(e => e.message).join(" ");
      return { success: false, error: msg || "Invalid input." };
    }

    await updateState(id, validated.data);
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to update state." };
  }
}

export async function softDeleteStateAction(id) {
  try {
    await requireAdmin();
    if (!id) return { success: false, error: "ID is required." };

    await softDeleteState(id);
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to delete state." };
  }
}

export async function restoreStateAction(id) {
  try {
    await requireAdmin();
    if (!id) return { success: false, error: "ID is required." };

    await restoreState(id);
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to restore state." };
  }
}

// ==========================================
// 4. CITY ACTIONS
// ==========================================

export async function createCityAction(values) {
  try {
    await requireAdmin();
    const validated = cityFormSchema.safeParse(values);
    if (!validated.success) {
      const msg = validated.error.errors.map(e => e.message).join(" ");
      return { success: false, error: msg || "Invalid input." };
    }

    await createCity(validated.data);
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to create city." };
  }
}

export async function updateCityAction(id, values) {
  try {
    await requireAdmin();
    const validated = cityFormSchema.safeParse(values);
    if (!validated.success) {
      const msg = validated.error.errors.map(e => e.message).join(" ");
      return { success: false, error: msg || "Invalid input." };
    }

    await updateCity(id, validated.data);
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to update city." };
  }
}

export async function softDeleteCityAction(id) {
  try {
    await requireAdmin();
    if (!id) return { success: false, error: "ID is required." };

    await softDeleteCity(id);
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to delete city." };
  }
}

export async function restoreCityAction(id) {
  try {
    await requireAdmin();
    if (!id) return { success: false, error: "ID is required." };

    await restoreCity(id);
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to restore city." };
  }
}
