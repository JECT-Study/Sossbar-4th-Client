export type ProfileReview = {
  id: string;
  content: string;
  tags: string[];
  reactionCount: number;
  reacted?: boolean;
};

export type Profile = {
  id: string;
  nickname: string;
  reviews: ProfileReview[];
};

export type GetProfileMeResponse = Profile;
export type PostReviewRequestResponse = { requestId: string; shareUrl: string };
export type PostReviewReactionResponse = { reacted: boolean; reactionCount: number };
