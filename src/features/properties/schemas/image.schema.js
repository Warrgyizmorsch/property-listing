import { z } from "zod";

/**
 * Zod validation schema for PropertyImage metadata entries.
 */
export const propertyImageSchema = z.object({
  url: z
    .string()
    .url({ message: "Image must contain a valid URL." }),
  publicId: z
    .string()
    .trim()
    .min(1, { message: "Public ID is required for image asset tracking." }),
});
