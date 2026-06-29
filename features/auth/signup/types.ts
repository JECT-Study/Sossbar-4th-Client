import type { FIELD_VALUES, USER_LINK_TYPE_VALUES } from './signup.constants';
import type { SignupFormSchema } from './signup.schemas';
import type { z } from 'zod';

export type SignupFormData = z.infer<typeof SignupFormSchema>;

export type FieldValue = (typeof FIELD_VALUES)[number];

export type UserLinkType = (typeof USER_LINK_TYPE_VALUES)[number];

export interface SignupUserLink {
  userLinkType: UserLinkType;
  userLink: string;
}

export type SignupPayload = {
  name: string;
  bio: string;
  requiredAgree: boolean;
  profileImage: File | null;
  fields: FieldValue[];
  links: SignupUserLink[];
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
