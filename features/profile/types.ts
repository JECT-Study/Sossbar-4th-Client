export interface Profile {
  userId: number;
  username: string;
  nickname: string;
  email: string;
  bio: string | null;
  profileImageUrl: string | null;
  userType: string;
}

export type UpdateProfileInfo = {
  username: string;
  bio: string;
};

export type UpdateProfilePayload = {
  info: UpdateProfileInfo;
  profileImage?: File | null;
};

export type UpdateProfileResponse = Profile;
