import type { ComponentType, SVGProps } from 'react';

import type { PositionValue } from '@/features/auth';
import { BackendIcon, FrontendIcon, ProductDesignerIcon, ProductManagerIcon } from '@/shared/assets/icons';

/** 닉네임 최대 글자 수 — 스키마 검증과 입력 필드 maxLength에서 공유 */
export const PROFILE_NICKNAME_MAX_LENGTH = 20;

/** 직군 뱃지 라벨·아이콘 매핑 — 프로필/프로젝트/마이페이지 등에서 공유 */
export const POSITION_BADGE_MAP: Record<
  PositionValue,
  { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  FE: { label: '프론트엔드', Icon: FrontendIcon },
  BE: { label: '백엔드', Icon: BackendIcon },
  PM: { label: '프로덕트 매니저', Icon: ProductManagerIcon },
  PD: { label: '프로덕트 디자이너', Icon: ProductDesignerIcon },
};

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
