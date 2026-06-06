import { z } from "zod";

/**
 * Zod validation schema for Property form submissions.
 */
export const propertyFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(100, { message: "Title must not exceed 100 characters." }),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(100, { message: "Slug must not exceed 100 characters." })
    .refine(
      (val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
      { message: "Slug must contain only lowercase letters, numbers, and hyphens." }
    )
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters long." }),
  price: z
    .coerce
    .number()
    .positive({ message: "Price must be a positive number." }),
  address: z
    .string()
    .trim()
    .min(5, { message: "Address must be at least 5 characters long." }),
  bedrooms: z
    .coerce
    .number()
    .int()
    .nonnegative({ message: "Bedrooms must be a non-negative integer." }),
  bathrooms: z
    .coerce
    .number()
    .int()
    .nonnegative({ message: "Bathrooms must be a non-negative integer." }),
  areaSize: z
    .coerce
    .number()
    .int()
    .positive({ message: "Area size must be a positive integer." }),
  contactNumber: z
    .string()
    .trim()
    .optional(),
  categoryId: z
    .string()
    .uuid({ message: "Please select a valid Category." }),
  purposeId: z
    .string()
    .uuid({ message: "Please select a valid Purpose." }),
  statusId: z
    .string()
    .uuid({ message: "Please select a valid Status." }),
  cityId: z
    .string()
    .uuid({ message: "Please select a valid City." }),
  isFeatured: z
    .boolean()
    .default(false),
});
