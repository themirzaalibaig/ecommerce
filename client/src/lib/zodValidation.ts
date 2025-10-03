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

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
