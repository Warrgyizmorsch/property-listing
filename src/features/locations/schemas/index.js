import { z } from "zod";

/**
 * Zod validation schema for Country form submissions.
 */
export const countryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Country name must be at least 2 characters long." })
    .max(50, { message: "Country name must not exceed 50 characters." }),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(50, { message: "Slug must not exceed 50 characters." })
    .refine(
      (val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
      { message: "Slug must contain only lowercase letters, numbers, and hyphens (e.g. 'canada')." }
    )
    .optional(),
});

/**
 * Zod validation schema for State form submissions.
 */
export const stateFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "State name must be at least 2 characters long." })
    .max(50, { message: "State name must not exceed 50 characters." }),
  countryId: z
    .string()
    .uuid({ message: "Please select a valid Country." }),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(50, { message: "Slug must not exceed 50 characters." })
    .refine(
      (val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
      { message: "Slug must contain only lowercase letters, numbers, and hyphens (e.g. 'ontario')." }
    )
    .optional(),
});

/**
 * Zod validation schema for City form submissions.
 */
export const cityFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "City name must be at least 2 characters long." })
    .max(50, { message: "City name must not exceed 50 characters." }),
  stateId: z
    .string()
    .uuid({ message: "Please select a valid State." }),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(50, { message: "Slug must not exceed 50 characters." })
    .refine(
      (val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
      { message: "Slug must contain only lowercase letters, numbers, and hyphens (e.g. 'toronto')." }
    )
    .optional(),
  coverImage: z
    .string()
    .trim()
    .url({ message: "Invalid cover image URL." })
    .nullable()
    .optional()
    .or(z.literal("")),
});
