import { z } from 'zod';

// Admin login schema validation
export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Category/Location metadata schema
export const metadataConfigSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }),
});

// Customer enquiry submission schema
export const enquirySchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().trim().email({ message: 'Invalid email address' }),
  phone: z.string().trim().min(7, { message: 'Phone number must be at least 7 digits' }),
  message: z.string().trim().min(10, { message: 'Message must be at least 10 characters' }),
  propertyId: z.string().uuid({ message: 'Invalid property association' }),
});

// Property creation/update schema
export const propertySchema = z.object({
  title: z.string().trim().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().trim().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.preprocess((val) => Number(val), z.number().positive({ message: 'Price must be a positive number' })),
  bedrooms: z.preprocess((val) => Number(val), z.number().int().nonnegative({ message: 'Bedrooms count must be zero or more' })),
  bathrooms: z.preprocess((val) => Number(val), z.number().int().nonnegative({ message: 'Bathrooms count must be zero or more' })),
  areaSize: z.preprocess((val) => Number(val), z.number().positive({ message: 'Area size must be greater than zero' })),
  address: z.string().trim().min(5, { message: 'Full address is required' }),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().uuid({ message: 'Select a valid category' }),
  locationId: z.string().uuid({ message: 'Select a valid location' }),
  statusId: z.string().uuid({ message: 'Select a valid property status' }),
  images: z.array(
    z.object({
      url: z.string().url({ message: 'Valid image URL is required' }),
      publicId: z.string().optional(),
    })
  ).min(1, { message: 'At least one property image is required' }),
});
