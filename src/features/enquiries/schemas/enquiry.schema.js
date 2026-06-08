import { z } from "zod";

// Valid status list matching database schema
export const ENQUIRY_STATUSES = [
  "NEW",
  "CONTACTED",
  "NEGOTIATION",
  "CLOSED",
  "CONVERTED",
  "RESOLVED",
];

export const enquiryStatusSchema = z.object({
  status: z.enum(ENQUIRY_STATUSES, {
    errorMap: () => ({ message: "Invalid enquiry status value." }),
  }),
});

export const enquiryNotesSchema = z.object({
  notes: z.string().nullable().optional().or(z.literal("")),
});

export const createEnquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  email: z.string().email("Please provide a valid email address."),
  phone: z
    .string()
    .min(5, "Phone number must be at least 5 characters.")
    .max(20, "Phone number must not exceed 20 characters.")
    .regex(/^[+\d\s()-]+$/, "Phone number contains invalid characters."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long.")
    .max(2000, "Message must not exceed 2000 characters."),
  propertyId: z
    .string()
    .uuid("Invalid property ID selection.")
    .optional()
    .nullable(),
});
