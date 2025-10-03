import { z } from 'zod';

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/, {
      message:
        'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character',
    }),
});

// Signup schema
export const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/, {
      message:
        'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character',
    }),
  image: z.object({
    url: z.string(),
    public_id: z.string(),
  }),
});

// Category schemas
export const categoryCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
  image: z
    .object({
      url: z.string(),
      public_id: z.string(),
    })
    .optional(),
});

export const categoryUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
  image: z
    .object({
      url: z.string(),
      public_id: z.string(),
    })
    .optional(),
});

// Product schemas
const imageSchema = z.object({
  url: z.string(),
  public_id: z.string(),
});

export const productCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name cannot exceed 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description cannot exceed 2000 characters'),
  price: z.number().min(0, 'Price cannot be negative'),
  tags: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
  thumbnail: imageSchema,
  images: z.array(imageSchema).min(1, 'At least one image is required').max(10, 'Max 10 images'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  size: z.array(z.enum(['xs', 's', 'm', 'l', 'xl'])).optional(),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name cannot exceed 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description cannot exceed 2000 characters'),
  price: z.number().min(0, 'Price cannot be negative'),
  tags: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
  thumbnail: imageSchema,
  images: z.array(imageSchema).min(1, 'At least one image is required').max(10, 'Max 10 images'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  size: z.array(z.enum(['xs', 's', 'm', 'l', 'xl'])).optional(),
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type CategoryCreateFormData = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateFormData = z.infer<typeof categoryUpdateSchema>;
export type ProductCreateFormData = z.infer<typeof productCreateSchema>;
export type ProductUpdateFormData = z.infer<typeof productUpdateSchema>;
