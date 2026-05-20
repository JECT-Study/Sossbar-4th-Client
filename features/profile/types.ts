export interface Profile {
  userId: number;
  nickname: string;
  realName: string;
  bio: string;
  profileImageUrl: string | null;
  email: string;
}

export type UpdateProfilePayload = Partial<Pick<Profile, 'nickname' | 'bio' | 'profileImageUrl'>>;
