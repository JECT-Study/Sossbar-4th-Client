export type Profile = {
  userId: number;
  nickname: string;
  realName: string;
  bio: string;
  profileImageUrl: string | null;
  email: string;
};

export type OnboardingRequest = {
  realName: string;
  bio?: string;
};

export type UpdateProfileRequest = Partial<Pick<Profile, 'realName' | 'bio'>>;
