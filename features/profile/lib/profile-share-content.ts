export const PROFILE_SHARE_TITLE = '[Sossbar] 프로젝트 동료 리뷰';

export const buildProfileShareDescription = (userName: string): string => {
  const displayName = userName.trim() || '회원';
  return `${displayName}님의 소프트 스킬을 확인해보세요!`;
};

export const buildReviewRequestDescription = (userName: string): string => {
  const displayName = userName.trim() || '회원';
  return `${displayName}님이 후기 작성을 요청했습니다`;
};
