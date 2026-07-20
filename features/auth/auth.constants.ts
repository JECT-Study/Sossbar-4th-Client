import type { ComponentType, SVGProps } from 'react';

import { BackendIcon, FrontendIcon, ProductDesignerIcon, ProductManagerIcon } from '@/shared/assets/icons';
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
  career: '직군을 최대 2개 선택하고 포트폴리오 링크를 첨부해주세요.',
  complete: '프로젝트를 생성하고 동료에게 후기를 요청해 프로필을 완성해 보세요!',
};

export const POSITION_VALUES = ['FE', 'BE', 'PM', 'PD'] as const;

type PositionIcon = ComponentType<SVGProps<SVGSVGElement>>;

export const POSITION_OPTIONS = [
  { value: 'FE', label: '프론트엔드', Icon: FrontendIcon },
  { value: 'BE', label: '백엔드', Icon: BackendIcon },
  { value: 'PM', label: '프로덕트 매니저', Icon: ProductManagerIcon },
  { value: 'PD', label: '프로덕트 디자이너', Icon: ProductDesignerIcon },
] as const satisfies readonly { value: (typeof POSITION_VALUES)[number]; label: string; Icon: PositionIcon }[];

export const POSITIONS_MAX_SELECT = 2;

export const USER_LINK_TYPE_VALUES = ['GITHUB', 'LINKEDIN', 'NOTION'] as const;

export const USER_LINK_TYPE_OPTIONS = [
  { value: 'GITHUB', label: 'GitHub' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'NOTION', label: 'Notion' },
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

export const LOGIN_MODAL_QUERY_KEY = 'modal';

export const LOGIN_MODAL_QUERY_VALUE = 'login';

export const LOGIN_RETURN_COOKIE_NAME = 'sossbar-login-return';

export const WITHDRAW_REASON_VALUES = ['low-quality', 'trust', 'alternative', 'difficulty', 'burden', 'other'] as const;

export type WithdrawReasonValue = (typeof WITHDRAW_REASON_VALUES)[number];

export const WITHDRAW_REASON_ENUM_MAP: Record<WithdrawReasonValue, string> = {
  'low-quality': 'LOW_QUALITY',
  trust: 'LOW_TRUST',
  alternative: 'FOUND_ALTERNATIVE',
  difficulty: 'HARD_TO_USE',
  burden: 'PRESSURE',
  other: 'ETC',
};

const WITHDRAW_REASON_LABELS: Record<WithdrawReasonValue, string> = {
  'low-quality': '서비스 퀄리티가 낮아요',
  trust: '신뢰도가 떨어져요',
  alternative: '대체할 만한 서비스를 찾았어요',
  difficulty: '서비스 사용이 어려워요',
  burden: '부담감이 있어요',
  other: '기타',
};

export const WITHDRAW_REASON_OPTIONS = WITHDRAW_REASON_VALUES.map((value) => ({
  value,
  label: WITHDRAW_REASON_LABELS[value],
}));
