import type { SignupFormSchema } from './schemas';
import type { z } from 'zod';

export type SignupFormData = z.infer<typeof SignupFormSchema>;
