import { z } from 'zod';

export const seoSettingSchema = z.object({
  metaTitle: z
    .string()
    .max(60, { message: 'Meta Title must be at most 60 characters' })
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform(val => val || null),
  metaDescription: z
    .string()
    .max(160, { message: 'Meta Description must be at most 160 characters' })
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform(val => val || null),
  metaKeywords: z
    .string()
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform(val => val || null),
  ogTitle: z
    .string()
    .max(60, { message: 'OG Title must be at most 60 characters' })
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform(val => val || null),
  ogDescription: z
    .string()
    .max(160, { message: 'OG Description must be at most 160 characters' })
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform(val => val || null),
  ogImage: z
    .string()
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform(val => {
      if (!val) return null;
      // If it doesn't start with http/https, we don't treat it as valid absolute URL but allow relative or just check URL format
      return val;
    })
    .refine(val => {
      if (!val) return true;
      try {
        new URL(val);
        return true;
      } catch (_) {
        return val.startsWith('/') || val.startsWith('http');
      }
    }, { message: 'OG Image must be a valid URL' }),
  canonicalUrl: z
    .string()
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform(val => val || null)
    .refine(val => {
      if (!val) return true;
      try {
        new URL(val);
        return true;
      } catch (_) {
        return false;
      }
    }, { message: 'Canonical URL must be a valid URL' }),
});

export const propertySeoSchema = z.object({
  metaTitle: z
    .string()
    .max(60, { message: 'Meta Title must be at most 60 characters' })
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform(val => val || null),
  metaDescription: z
    .string()
    .max(160, { message: 'Meta Description must be at most 160 characters' })
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform(val => val || null),
});
