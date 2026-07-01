import type { PositionValue, UserLinkType } from '@/features/auth';

import type { ProfileEditFormSchema } from './profile.schemas';
import type { z } from 'zod';

export interface ProfileLink {
  linkId: number;
  userLinkType: UserLinkType;
  userLink: string;
}

/** GET /users/profile/{userLink} 응답 — 누구나 조회 가능한 공개 프로필 정보 */
export interface PublicProfile {
  userId: number;
  userLink: string;
  username: string;
  bio: string | null;
  profileImageUrl: string | null;
  defaultPositions: PositionValue[];
  links: ProfileLink[];
}

/** GET /users/profile 응답 — 본인만 조회 가능, 공개 정보에 계정 정보가 더해진다 */
export interface MyProfile extends PublicProfile {
  email: string;
  userType: string;
  marketingAgree: boolean;
}

export interface UpdateProfileInfo {
  username: string;
  bio: string;
  marketingAgree: boolean;
}

export interface UpdateProfilePayload {
  info: UpdateProfileInfo;
  profileImage?: File | null;
}

export type UpdateProfileResponse = MyProfile;

export type ProfileEditFormData = z.infer<typeof ProfileEditFormSchema>;

export interface UseProfileEditFormParams {
  profile: MyProfile;
  onSubmitProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

export interface UseProfileShareParams {
  userLink: string;
  userName?: string;
}
