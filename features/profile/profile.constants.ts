/** 닉네임 최대 글자 수 — 스키마 검증과 입력 필드 maxLength에서 공유 */
export const PROFILE_NICKNAME_MAX_LENGTH = 20;

/** 한 줄 소개 최대 글자 수 — 스키마 검증과 입력 필드 maxLength에서 공유 */
export const PROFILE_BIO_MAX_LENGTH = 50;

/** 프로필 상세 탭 상태를 담는 URL query parameter key */
export const PROFILE_DETAIL_TAB_QUERY_KEY = 'tab';

/** 프로필 상세 탭의 유효한 값 목록 */
export const PROFILE_DETAIL_TABS = ['all', 'projects'] as const;

/** 프로필 상세 탭 값 타입 */
export type ProfileDetailTab = (typeof PROFILE_DETAIL_TABS)[number];

/** 프로필 상세 기본 탭 */
export const DEFAULT_PROFILE_DETAIL_TAB: ProfileDetailTab = 'all';

/** 주어진 값이 유효한 프로필 상세 탭 값인지 확인한다. */
export const isProfileDetailTab = (value: string | null): value is ProfileDetailTab =>
  value !== null && PROFILE_DETAIL_TABS.includes(value as ProfileDetailTab);
