import { z } from 'zod';

const email = z
  .string({ required_error: 'Email is required' })
  .trim()
  .min(1, 'Email is required')
  .max(254, 'Email is too long')
  .email('Enter a valid email address')
  .toLowerCase();

const password = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be 72 characters or fewer')
  .regex(/[A-Za-z]/, 'Password must include at least one letter')
  .regex(/[0-9]/, 'Password must include at least one number');

const name = z
  .string({ required_error: 'Name is required' })
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(60, 'Name must be 60 characters or fewer');

export const registerSchema = z.object({
  name,
  email,
  password,
  confirmPassword: z.string().optional(),
}).refine((data) => !data.confirmPassword || data.confirmPassword === data.password, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email,
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required').max(72),
});

export const updateProfileSchema = z.object({
  name: name.optional(),
  preferences: z
    .object({
      emailNotifications: z.boolean().optional(),
      weeklyDigest: z.boolean().optional(),
      theme: z.enum(['dark', 'light', 'system']).optional(),
      learningGoalMinutes: z
        .number({ invalid_type_error: 'Learning goal must be a number' })
        .int('Learning goal must be a whole number')
        .min(5, 'Learning goal must be at least 5 minutes')
        .max(240, 'Learning goal must be 240 minutes or less')
        .optional(),
    })
    .strict()
    .optional(),
}).refine((data) => data.name !== undefined || data.preferences !== undefined, {
  message: 'Nothing to update',
});

export const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: 'Current password is required' }).min(1, 'Current password is required'),
  newPassword: password,
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from your current password',
  path: ['newPassword'],
});

export const bookmarkSchema = z.object({
  articleSlug: z.string({ required_error: 'Article is required' }).trim().min(1, 'Article is required'),
});

export const submitQuizSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1, 'Question id is required'),
        selectedIndex: z
          .number({ invalid_type_error: 'Select an answer for every question' })
          .int()
          .min(0, 'Invalid answer selected'),
      }),
      { required_error: 'Answers are required' }
    )
    .min(1, 'Answer at least one question'),
  durationSeconds: z.number().int().min(0).max(3600).optional(),
});

export const articleQuerySchema = z.object({
  category: z.string().trim().max(60).optional(),
  q: z.string().trim().max(100).optional(),
  featured: z.enum(['true', 'false']).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});
