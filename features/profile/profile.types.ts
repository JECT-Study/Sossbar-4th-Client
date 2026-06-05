export interface Profile {
  userId: number;
  username: string;
  nickname: string;
  email: string;
  bio: string | null;
  profileImageUrl: string | null;
  userType: string;
}

export interface UpdateProfileInfo {
  username: string;
  bio: string;
}

export interface UpdateProfilePayload {
  info: UpdateProfileInfo;
  profileImage?: File | null;
}

export type UpdateProfileResponse = Profile;
