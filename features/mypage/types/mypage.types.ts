export interface Profile {
  userId: number;
  username: string;
  nickname: string;
  email: string;
  bio: string;
  profileImageUrl: string | null;
  userType: string;
  marketingAgree: boolean;
}

export interface ProfileResponse {
  status: number;
  code: string;
  message: string;
  data: Profile;
}
