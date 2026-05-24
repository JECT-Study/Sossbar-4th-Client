import { buildProfileShareUrl } from './build-profile-share-url';

/**
 * 카카오톡 등 채팅 앱 링크 미리보기는 URL의 Open Graph 메타(제목·설명)로 표시됩니다.
 * 클립보드에는 URL만 복사합니다.
 */
export const buildProfileShareClipboardText = (userId: number): string => buildProfileShareUrl(userId);
