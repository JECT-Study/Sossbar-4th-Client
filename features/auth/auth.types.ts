import type { POSITION_VALUES, USER_LINK_TYPE_VALUES } from './auth.constants';
import type { SignupFormSchema } from './auth.schemas';
import type { z } from 'zod';

export interface LoginResponse {
  accessToken: string;
  userId: number;
}

export type SignupFormData = z.infer<typeof SignupFormSchema>;

export type PositionValue = (typeof POSITION_VALUES)[number];

export type UserLinkType = (typeof USER_LINK_TYPE_VALUES)[number];

export interface SignupUserLink {
  userLinkType: UserLinkType;
  userLink: string;
}

export interface SignupResponseLink extends SignupUserLink {
  linkId: number;
}

export type SignupPayload = {
  name: string;
  bio: string;
  requiredAgree: boolean;
  profileImage: File | null;
  positions: PositionValue[];
  links: SignupUserLink[];
};

export interface SignupResponse {
  userId: number;
  username: string;
  email: string;
  bio: string;
  profileImageUrl: string | null;
  userType: string;
  defaultPositions: string[];
  links: SignupResponseLink[];
  marketingAgree: boolean;
}

export interface KakaoLoginResult {
  ok: boolean;
  setCookieHeaders: string[];
  accessTokenCookie: string;
}
