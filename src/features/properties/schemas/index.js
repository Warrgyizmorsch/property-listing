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
    .refine((val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val), {
      message:
        "Slug must contain only lowercase letters, numbers, and hyphens.",
    })
    .optional(),
  propertyCode: z
    .string()
    .trim()
    .max(20, { message: "Property code must be at most 20 characters." })
    .optional()
    .nullable()
    .or(z.literal("")),
  unitType: z
    .string()
    .trim()
    .min(1, { message: "Property / Unit Type is required." })
    .max(50, { message: "Property / Unit Type must not exceed 50 characters." }),
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters long." }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number." }),
  bedrooms: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Bedrooms must be a non-negative integer." }),
  bathrooms: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Bathrooms must be a non-negative integer." }),
  areaSize: z.coerce
    .number()
    .int()
    .positive({ message: "Area size must be a positive integer." }),
  contactNumber: z.string().trim().optional().nullable().or(z.literal("")),
  projectId: z.string().uuid({ message: "Please select a valid Project." }),
  statusId: z.string().uuid({ message: "Please select a valid Status." }),
  isFeatured: z.boolean().default(false),
  metaTitle: z
    .string()
    .max(60, { message: "Meta Title must be at most 60 characters." })
    .optional()
    .nullable()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(160, { message: "Meta Description must be at most 160 characters." })
    .optional()
    .nullable()
    .or(z.literal("")),
  specifications: z
    .array(
      z.object({
        title: z.string().trim().min(1, { message: "Specification title is required." }),
        value: z.string().trim().min(1, { message: "Specification value is required." }),
      })
    )
    .optional()
    .default([]),
  images: z
    .array(
      z.object({
        url: z.string().url({ message: "Image must contain a valid URL." }),
        publicId: z.string().trim().min(1, { message: "Public ID is required." }),
        isFeatured: z.boolean().default(false),
        sortOrder: z.number().int().default(0),
      })
    )
    .optional()
    .default([]),
});
