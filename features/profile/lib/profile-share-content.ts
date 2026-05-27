export const PROFILE_SHARE_TITLE = '[소스바] 프로젝트 동료 리뷰';

/** API 연동 전 목 표시명 (userId별) */
const MOCK_PROFILE_DISPLAY_NAMES: Record<number, string> = {
  1: '현준',
};

export const getProfileShareDisplayName = (userId: number): string => MOCK_PROFILE_DISPLAY_NAMES[userId] ?? '회원';

export const buildProfileShareDescription = (userName: string): string => {
  const displayName = userName.trim() || '회원';
  return `${displayName}님이 후기 작성을 요청했습니다`;
};
