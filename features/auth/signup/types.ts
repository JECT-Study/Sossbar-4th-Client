import type { FIELD_VALUES, USER_LINK_TYPE_VALUES } from './signup-constants';
import type { SignupFormSchema } from './signup-form.schema';
import type { z } from 'zod';

export type SignupFormData = z.infer<typeof SignupFormSchema>;

export type FieldValue = (typeof FIELD_VALUES)[number];

export type UserLinkType = (typeof USER_LINK_TYPE_VALUES)[number];

export type SignupPayload = {
  name: string;
  bio: string;
  requiredAgree: boolean;
  marketingAgree: boolean;
  profileImage: File | null;
};

export interface SignupResponse {
  userId: number;
  username: string;
  nickname?: string;
  email: string;
  bio: string;
  profileImageUrl: string | null;
  userType: string;
}
