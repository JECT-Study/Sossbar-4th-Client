import type { SignupFormSchema } from './signup-form.schema';
import type { z } from 'zod';

export type SignupFormData = z.infer<typeof SignupFormSchema>;

export type SignupPayload = Pick<SignupFormData, 'name' | 'bio'>;

export interface SignupResponse {
  userId: number;
  username: string;
  nickname: string;
  email: string;
  bio: string;
  profileImageUrl: string | null;
  userType: string;
}
