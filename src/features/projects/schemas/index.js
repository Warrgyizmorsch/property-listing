import { z } from "zod";

/**
 * Zod validation schema for Project create and edit form submissions.
 */
export const projectFormSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(3, { message: "Project name must be at least 3 characters long." })
    .max(100, { message: "Project name must not exceed 100 characters." }),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(100, { message: "Slug must not exceed 100 characters." })
    .refine((val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val), {
      message: "Slug must contain only lowercase letters, numbers, and hyphens.",
    })
    .optional(),
  address: z
    .string()
    .trim()
    .min(5, { message: "Address must be at least 5 characters long." }),
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters long." }),
  shortDescription: z
    .string()
    .trim()
    .max(500, { message: "Short description must not exceed 500 characters." })
    .optional()
    .nullable()
    .or(z.literal("")),
  builderName: z
    .string()
    .trim()
    .min(2, { message: "Builder name must be at least 2 characters long." })
    .max(100, { message: "Builder name must not exceed 100 characters." }),
  builderPhone: z
    .string()
    .trim()
    .max(30, { message: "Builder phone must be at most 30 characters." })
    .optional()
    .nullable()
    .or(z.literal("")),
  builderEmail: z
    .string()
    .trim()
    .email("Please provide a valid builder email address.")
    .optional()
    .nullable()
    .or(z.literal("")),
  status: z.enum(["ONGOING", "COMPLETED", "UPCOMING"], {
    errorMap: () => ({ message: "Please select a valid Project status." }),
  }),
  bannerImage: z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  mainImage: z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  brochureFile: z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  googleMapIframe: z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Display order must be a non-negative integer." })
    .default(0),
  categoryId: z.string().uuid({ message: "Please select a valid Category." }),
  cityId: z.string().uuid({ message: "Please select a valid City." }),
  metaTitle: z
    .string()
    .max(80, { message: "Meta Title must be at most 80 characters." })
    .optional()
    .nullable()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(160, { message: "Meta Description must be at most 160 characters." })
    .optional()
    .nullable()
    .or(z.literal("")),
  amenities: z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  highlights: z
    .string()
    .trim()
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
