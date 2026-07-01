import { ROUTES } from '@/shared/constants/routes';
import { SHARE_USER_NAME_PARAM } from '@/shared/constants/share-query';
import { buildShareOgMetadata } from '@/shared/lib/build-share-metadata';
import { getSiteOrigin } from '@/shared/lib/get-site-origin';

import type { Metadata } from 'next';

export const PROFILE_SHARE_TITLE = '[Sossbar] 프로젝트 동료 리뷰';

export const buildProfileShareDescription = (userName: string): string => {
  const displayName = userName.trim() || '회원';
  return `${displayName}님의 소프트 스킬을 확인해보세요!`;
};

export const buildReviewRequestDescription = (userName: string): string => {
  const displayName = userName.trim() || '회원';
  return `${displayName}님이 후기 작성을 요청했습니다`;
};

export const buildProfileShareUrl = (userId: number, userName?: string): string => {
  const path = ROUTES.PROFILE(userId);
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
export const buildProfileShareClipboardText = (userId: number, userName?: string): string =>
  buildProfileShareUrl(userId, userName);

export const buildProfileShareMetadata = (userId: number, userName?: string, path?: string): Metadata => {
  const displayName = userName?.trim() || '회원';
  const description = buildProfileShareDescription(displayName);
  const profilePath = path ?? `/profile/${userId}`;

  return buildShareOgMetadata({
    description,
    path: profilePath,
  });
};
