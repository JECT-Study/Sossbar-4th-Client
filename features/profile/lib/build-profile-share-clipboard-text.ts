import { buildProfileShareUrl } from './build-profile-share-url';

/**
 * 카카오톡 등 채팅 앱 링크 미리보기는 URL의 Open Graph 메타(제목·설명)로 표시됩니다.
 * OG 크롤러는 인증 쿠키가 없으므로 프로필 소유자 이름을 쿼리에 포함합니다.
 */
export const buildProfileShareClipboardText = (userId: number, userName?: string): string =>
  buildProfileShareUrl(userId, userName);
