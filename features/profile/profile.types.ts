export interface Profile {
  userId: number;
  userLink: string;
  username: string;
  nickname: string;
  email: string;
  bio: string | null;
  profileImageUrl: string | null;
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

export type UpdateProfileResponse = Profile;
