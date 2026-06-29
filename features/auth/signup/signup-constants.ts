import type { StepIndicatorStep } from '@/shared/components/step-indicator';

export const BIO_MAX_LENGTH = 50;

export const NAME_MAX_LENGTH = 20;

export const SIGNUP_STEPS = [
  { id: 'basic', label: '기본 정보' },
  { id: 'fields', label: '분야 선택' },
  { id: 'complete', label: '가입 완료' },
] as const satisfies readonly StepIndicatorStep[];

export type SignupStepId = (typeof SIGNUP_STEPS)[number]['id'];

export const FIELD_OPTIONS = [
  { value: 'FE', label: '💻 프론트엔드' },
  { value: 'BE', label: '🗄️ 백엔드' },
  { value: 'PM', label: '📋 프로덕트 매니저' },
  { value: 'PD', label: '🎨 프로덕트 디자이너' },
] as const satisfies readonly { value: string; label: string }[];

export const FIELDS_MAX_SELECT = 2;

export const USER_LINK_TYPE_OPTIONS = [
  { label: 'Link', value: 'LINK' },
  { label: 'GitHub', value: 'GITHUB' },
  { label: 'Instagram', value: 'INSTAGRAM' },
  { label: 'Behance', value: 'BEHANCE' },
  { label: 'Brunch', value: 'BRUNCH' },
] as const;

export const USER_LINKS_MAX = 3;

export const PROFILE_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

export const PROFILE_IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp';

export const AGREEMENTS = [
  { key: 'age', label: '만 14세 이상입니다.', required: true },
  {
    key: 'terms',
    linkLabel: '서비스 이용약관',
    suffix: '에 동의합니다.',
    required: true,
    url: '/policies/terms-of-service',
  },
  {
    key: 'privacy',
    linkLabel: '개인정보 수집/이용',
    suffix: '에 동의합니다.',
    required: true,
    url: '/policies/privacy-policy',
  },
  {
    key: 'marketing',
    label: '마케팅 수신・홍보 목적의 개인정보 수집 및 이용에 동의합니다.',
    required: false,
  },
] as const;
