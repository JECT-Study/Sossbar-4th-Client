export interface UserInfoResDto {
  userId: number;
  username: string | null;
  email: string;
  bio: string | null;
  profileImageUrl: string | null;
  userType: string;
}
