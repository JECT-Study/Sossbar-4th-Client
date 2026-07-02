import type { ProfileLinkType, ProfilePosition } from './profile.types';

/** 닉네임 최대 글자 수. 스키마 검증과 입력 필드 maxLength에서 공유한다. */
export const PROFILE_NICKNAME_MAX_LENGTH = 20;

/** 한 줄 소개 최대 글자 수. 스키마 검증과 입력 필드 maxLength에서 공유한다. */
export const PROFILE_BIO_MAX_LENGTH = 50;

export const PROFILE_POSITION_LABELS: Record<ProfilePosition, string> = {
  FE: '프론트엔드',
  BE: '백엔드',
  PM: '프로덕트 매니저',
  PD: '프로덕트 디자이너',
};

export const PROFILE_LINK_TYPE_LABELS: Record<ProfileLinkType, string> = {
  LINK: 'Link',
  GITHUB: 'GitHub',
  INSTAGRAM: 'Instagram',
  BEHANCE: 'Behance',
  BRUNCH: 'Brunch',
};
