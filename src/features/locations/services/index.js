import { db } from "@/lib/db";
import { slugify } from "@/lib/slugify";

// ==========================================
// 1. COUNTRIES SERVICE
// ==========================================

export async function getCountries({ search = "", page = 1, limit = 10, showDeleted = false } = {}) {
  try {
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: showDeleted ? { not: null } : null,
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { slug: { contains: search } },
            ],
          }
        : {}),
    };

    const [countries, total] = await Promise.all([
      db.country.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              states: {
                where: { deletedAt: null },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      db.country.count({ where }),
    ]);

    return {
      countries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw new Error("Failed to load countries.");
  }
}

export async function createCountry({ name, slug }) {
  const generatedSlug = slug ? slugify(slug) : slugify(name);

  // Check for duplicates
  const existing = await db.country.findFirst({
    where: {
      OR: [
        { name: { equals: name } },
        { slug: { equals: generatedSlug } },
      ],
    },
  });

  if (existing) {
    if (existing.deletedAt === null) {
      throw new Error(`Country "${name}" or slug "${generatedSlug}" already exists.`);
    } else {
      throw new Error(`Country "${name}" is archived. Please restore it or choose another name.`);
    }
  }

  return db.country.create({
    data: { name, slug: generatedSlug },
  });
}

export async function updateCountry(id, { name, slug }) {
  const generatedSlug = slug ? slugify(slug) : slugify(name);

  const existing = await db.country.findFirst({
    where: {
      NOT: { id },
      OR: [
        { name: { equals: name } },
        { slug: { equals: generatedSlug } },
      ],
    },
  });

  if (existing) {
    if (existing.deletedAt === null) {
      throw new Error(`Another active country with name "${name}" or slug "${generatedSlug}" already exists.`);
    } else {
      throw new Error(`Country "${name}" exists in the archive. Please restore it or choose another name.`);
    }
  }

  return db.country.update({
    where: { id },
    data: { name, slug: generatedSlug },
  });
}

export async function softDeleteCountry(id) {
  const country = await db.country.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          states: { where: { deletedAt: null } },
        },
      },
    },
  });

  if (!country) throw new Error("Country not found.");
  if (country._count.states > 0) {
    throw new Error(`Cannot archive country "${country.name}". It contains ${country._count.states} active states.`);
  }

  return db.country.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function restoreCountry(id) {
  const country = await db.country.findUnique({ where: { id } });
  if (!country) throw new Error("Country not found.");

  const conflict = await db.country.findFirst({
    where: {
      deletedAt: null,
      OR: [
        { name: { equals: country.name } },
        { slug: { equals: country.slug } },
      ],
    },
  });

  if (conflict) {
    throw new Error(`Cannot restore. An active country with name "${country.name}" or slug "${country.slug}" already exists.`);
  }

  return db.country.update({
    where: { id },
    data: { deletedAt: null },
  });
}

// ==========================================
// 2. STATES SERVICE
// ==========================================

export async function getStates({ search = "", page = 1, limit = 10, countryId = "", showDeleted = false } = {}) {
  try {
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: showDeleted ? { not: null } : null,
      ...(countryId ? { countryId } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { slug: { contains: search } },
              { country: { name: { contains: search } } },
            ],
          }
        : {}),
    };

    const [states, total] = await Promise.all([
      db.state.findMany({
        where,
        skip,
        take: limit,
        include: {
          country: {
            select: { id: true, name: true },
          },
          _count: {
            select: {
              cities: { where: { deletedAt: null } },
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      db.state.count({ where }),
    ]);

    return {
      states,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching states:", error);
    throw new Error("Failed to load states.");
  }
}

export async function createState({ name, slug, countryId }) {
  const generatedSlug = slug ? slugify(slug) : slugify(name);

  // Check unique constraints within countryId
  const existing = await db.state.findFirst({
    where: {
      countryId,
      OR: [
        { name: { equals: name } },
        { slug: { equals: generatedSlug } },
      ],
    },
  });

  if (existing) {
    if (existing.deletedAt === null) {
      throw new Error(`A state named "${name}" or slug "${generatedSlug}" already exists in this country.`);
    } else {
      throw new Error(`A state named "${name}" exists in this country's archive. Please restore it.`);
    }
  }

  return db.state.create({
    data: { name, slug: generatedSlug, countryId },
  });
}

export async function updateState(id, { name, slug, countryId }) {
  const generatedSlug = slug ? slugify(slug) : slugify(name);

  const existing = await db.state.findFirst({
    where: {
      NOT: { id },
      countryId,
      OR: [
        { name: { equals: name } },
        { slug: { equals: generatedSlug } },
      ],
    },
  });

  if (existing) {
    if (existing.deletedAt === null) {
      throw new Error(`Another state named "${name}" or slug "${generatedSlug}" already exists in this country.`);
    } else {
      throw new Error(`A state named "${name}" exists in this country's archive. Please restore it.`);
    }
  }

  return db.state.update({
    where: { id },
    data: { name, slug: generatedSlug, countryId },
  });
}

export async function softDeleteState(id) {
  const state = await db.state.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          cities: { where: { deletedAt: null } },
        },
      },
    },
  });

  if (!state) throw new Error("State not found.");
  if (state._count.cities > 0) {
    throw new Error(`Cannot archive state "${state.name}". It contains ${state._count.cities} active cities.`);
  }

  return db.state.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function restoreState(id) {
  const state = await db.state.findUnique({
    where: { id },
    include: { country: true },
  });

  if (!state) throw new Error("State not found.");

  // Check if parent country is archived
  if (state.country.deletedAt !== null) {
    throw new Error(`Cannot restore state "${state.name}". The parent country "${state.country.name}" is archived. Restore the country first.`);
  }

  // Check conflicts within countryId
  const conflict = await db.state.findFirst({
    where: {
      countryId: state.countryId,
      deletedAt: null,
      OR: [
        { name: { equals: state.name } },
        { slug: { equals: state.slug } },
      ],
    },
  });

  if (conflict) {
    throw new Error(`Cannot restore state. An active state with name "${state.name}" or slug "${state.slug}" already exists in "${state.country.name}".`);
  }

  return db.state.update({
    where: { id },
    data: { deletedAt: null },
  });
}

// ==========================================
// 3. CITIES SERVICE
// ==========================================

export async function getCities({ search = "", page = 1, limit = 10, stateId = "", showDeleted = false } = {}) {
  try {
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: showDeleted ? { not: null } : null,
      ...(stateId ? { stateId } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { slug: { contains: search } },
              { state: { name: { contains: search } } },
              { state: { country: { name: { contains: search } } } },
            ],
          }
        : {}),
    };

    const [cities, total] = await Promise.all([
      db.city.findMany({
        where,
        skip,
        take: limit,
        include: {
          state: {
            select: {
              id: true,
              name: true,
              country: { select: { id: true, name: true } },
            },
          },
          _count: {
            select: {
              properties: { where: { deletedAt: null } },
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      db.city.count({ where }),
    ]);

    return {
      cities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw new Error("Failed to load cities.");
  }
}

export async function createCity({ name, slug, stateId }) {
  const generatedSlug = slug ? slugify(slug) : slugify(name);

  // Check unique constraints within stateId
  const existing = await db.city.findFirst({
    where: {
      stateId,
      OR: [
        { name: { equals: name } },
        { slug: { equals: generatedSlug } },
      ],
    },
  });

  if (existing) {
    if (existing.deletedAt === null) {
      throw new Error(`A city named "${name}" or slug "${generatedSlug}" already exists in this state.`);
    } else {
      throw new Error(`A city named "${name}" exists in this state's archive. Please restore it.`);
    }
  }

  return db.city.create({
    data: { name, slug: generatedSlug, stateId },
  });
}

export async function updateCity(id, { name, slug, stateId }) {
  const generatedSlug = slug ? slugify(slug) : slugify(name);

  const existing = await db.city.findFirst({
    where: {
      NOT: { id },
      stateId,
      OR: [
        { name: { equals: name } },
        { slug: { equals: generatedSlug } },
      ],
    },
  });

  if (existing) {
    if (existing.deletedAt === null) {
      throw new Error(`Another city named "${name}" or slug "${generatedSlug}" already exists in this state.`);
    } else {
      throw new Error(`A city named "${name}" exists in this state's archive. Please restore it.`);
    }
  }

  return db.city.update({
    where: { id },
    data: { name, slug: generatedSlug, stateId },
  });
}

export async function softDeleteCity(id) {
  const city = await db.city.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          properties: { where: { deletedAt: null } },
        },
      },
    },
  });

  if (!city) throw new Error("City not found.");
  if (city._count.properties > 0) {
    throw new Error(`Cannot archive city "${city.name}". It has ${city._count.properties} active property listings assigned.`);
  }

  return db.city.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function restoreCity(id) {
  const city = await db.city.findUnique({
    where: { id },
    include: {
      state: {
        include: { country: true },
      },
    },
  });

  if (!city) throw new Error("City not found.");

  // Check parent state/country archiving
  if (city.state.deletedAt !== null) {
    throw new Error(`Cannot restore city "${city.name}". The parent state "${city.state.name}" is archived. Restore the state first.`);
  }

  // Check conflicts within stateId
  const conflict = await db.city.findFirst({
    where: {
      stateId: city.stateId,
      deletedAt: null,
      OR: [
        { name: { equals: city.name } },
        { slug: { equals: city.slug } },
      ],
    },
  });

  if (conflict) {
    throw new Error(`Cannot restore. An active city with name "${city.name}" or slug "${city.slug}" already exists in "${city.state.name}".`);
  }

  return db.city.update({
    where: { id },
    data: { deletedAt: null },
  });
}
