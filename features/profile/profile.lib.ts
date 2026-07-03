import { ROUTES } from '@/shared/constants/routes';
import { SHARE_USER_NAME_PARAM } from '@/shared/constants/share-query';
import { buildShareOgMetadata } from '@/shared/lib/build-share-metadata';
import { getSiteOrigin } from '@/shared/lib/get-site-origin';

import type { MyProfile, UpdateProfileInfo } from './profile.types';
import type { Metadata } from 'next';

/**
 * PATCH /users/profile 요청 페이로드를 만든다.
 * 마이페이지 3개 섹션은 API 하나를 공유하므로, 저장하는 섹션만 override로 덮어쓰고
 * 나머지 필드는 현재 프로필 값을 그대로 재전송한다. `requiredAgree`는 서비스 정책상 항상 true.
 */
export const buildUpdateProfileInfo = (
  profile: MyProfile,
  overrides: Partial<UpdateProfileInfo> = {},
): UpdateProfileInfo => ({
  username: profile.username,
  bio: profile.bio ?? '',
  defaultPositions: profile.defaultPositions,
  links: profile.links.map(({ userLinkType, userLink }) => ({ userLinkType, userLink })),
  requiredAgree: true,
  marketingAgree: profile.marketingAgree,
  ...overrides,
});

export const PROFILE_SHARE_TITLE = '[Sossbar] 프로젝트 동료 리뷰';

export const buildProfileShareDescription = (userName: string): string => {
  const displayName = userName.trim() || '회원';
  return `${displayName}님의 소프트 스킬을 확인해보세요!`;
};

export const buildReviewRequestDescription = (userName: string): string => {
  const displayName = userName.trim() || '회원';
  return `${displayName}님이 후기 작성을 요청했습니다`;
};

export const buildProfileShareUrl = (userLink: string, userName?: string): string => {
  const path = ROUTES.PROFILE(userLink);
  const searchParams = new URLSearchParams();

  const trimmedName = userName?.trim();
  if (trimmedName) {
    searchParams.set(SHARE_USER_NAME_PARAM, trimmedName);
  }

  const query = searchParams.toString();
  const pathWithQuery = query ? `${path}?${query}` : path;
  const origin = getSiteOrigin();

  return origin ? `${origin}${pathWithQuery}` : pathWithQuery;
};

/**
 * 카카오톡 등 채팅 앱 링크 미리보기는 URL의 Open Graph 메타(제목·설명)로 표시됩니다.
 * OG 크롤러는 인증 쿠키가 없으므로 프로필 소유자 이름을 쿼리에 포함합니다.
 */
export const buildProfileShareClipboardText = (userLink: string, userName?: string): string =>
  buildProfileShareUrl(userLink, userName);

export const buildProfileShareMetadata = (userLink: string, userName?: string, path?: string): Metadata => {
  const displayName = userName?.trim() || '회원';
  const description = buildProfileShareDescription(displayName);
  const profilePath = path ?? `/profile/${userLink}`;

  return buildShareOgMetadata({
    description,
    path: profilePath,
  });
};
