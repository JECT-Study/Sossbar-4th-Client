import type { StepIndicatorStep } from '@/shared/components/step-indicator';

export const BIO_MAX_LENGTH = 50;

export const NAME_MAX_LENGTH = 20;

export const SIGNUP_STEPS = [
  { id: 'basic', label: '기본 정보' },
  { id: 'career', label: '맞춤 설정' },
  { id: 'complete', label: '가입 완료' },
] as const satisfies readonly StepIndicatorStep[];

export type SignupStepId = (typeof SIGNUP_STEPS)[number]['id'];

export const SIGNUP_STEP_DESCRIPTIONS: Record<SignupStepId, string> = {
  basic: '기본 정보를 입력해 주세요.',
  career: '나를 잘 나타내는 분야와 링크를 등록해 주세요.',
  complete: '프로젝트를 생성하고 동료에게 후기를 요청해 프로필을 완성해 보세요!',
};

export const FIELD_VALUES = ['FE', 'BE', 'PM', 'PD'] as const;

export const FIELD_OPTIONS = [
  { value: 'FE', label: '💻 프론트엔드' },
  { value: 'BE', label: '🗄️ 백엔드' },
  { value: 'PM', label: '📋 프로덕트 매니저' },
  { value: 'PD', label: '🎨 프로덕트 디자이너' },
] as const satisfies readonly { value: (typeof FIELD_VALUES)[number]; label: string }[];

export const FIELDS_MAX_SELECT = 2;

export const USER_LINK_TYPE_VALUES = ['LINK', 'GITHUB', 'INSTAGRAM', 'BEHANCE', 'BRUNCH'] as const;

export const USER_LINK_TYPE_OPTIONS = [
  { value: 'LINK', label: 'Link' },
  { value: 'GITHUB', label: 'GitHub' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'BEHANCE', label: 'Behance' },
  { value: 'BRUNCH', label: 'Brunch' },
] as const satisfies readonly { value: (typeof USER_LINK_TYPE_VALUES)[number]; label: string }[];

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
] as const;
