export type Profile = {
  userId: number;
  nickname: string;
  realName: string;
  bio: string;
  profileImageUrl: string | null;
  email: string;
};

export type UpdateProfileRequest = {
  nickname?: string;
  bio?: string;
  profileImageUrl?: string | null;
};
