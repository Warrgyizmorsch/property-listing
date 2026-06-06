import { z } from "zod";

/**
 * Zod validation schema for Category create and edit form submissions.
 */
export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name must not exceed 50 characters." }),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(50, { message: "Slug must not exceed 50 characters." })
    .refine(
      (val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
      { message: "Slug must contain only lowercase letters, numbers, and hyphens (e.g. 'my-category')." }
    )
    .optional(),
});
