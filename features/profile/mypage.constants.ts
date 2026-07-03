/**
 * 마이페이지 프레젠테이션 전용 목업 데이터.
 * 커리어/알림 정보는 Profile 모델에 없으므로 UI 표시용 상수로만 존재한다.
 */

import type { UserLinkType } from '@/features/auth';

export interface MypageSelectOption {
  value: string;
  label: string;
}

export interface UrlEntry {
  id: string;
  url: string;
  type: UserLinkType;
}

/** 커리어 분야 multi-select 옵션 (목업) */
export const CAREER_FIELD_OPTIONS: readonly MypageSelectOption[] = [
  { value: 'product-designer', label: '프로덕트 디자이너' },
  { value: 'frontend', label: '프론트엔드' },
  { value: 'backend', label: '백엔드' },
  { value: 'pm', label: '프로덕트 매니저' },
  { value: 'data', label: '데이터 분석가' },
];

/** 커리어 분야 초기 선택값 (목업) */
export const MYPAGE_MOCK_FIELDS: readonly string[] = ['product-designer', 'frontend'];

/** URL 리스트 초기값 (목업) */
export const MYPAGE_MOCK_URLS: readonly UrlEntry[] = [
  { id: 'url-1', url: 'https://github.com/', type: 'GITHUB' },
  { id: 'url-2', url: 'https://linkedin.com/', type: 'LINKEDIN' },
  { id: 'url-3', url: 'https://notion.so/', type: 'NOTION' },
];
