import type { StepIndicatorStep } from '@/shared/components/step-indicator';

export const REVIEW_STEPS = [
  { id: 'tag', label: '태그 선택' },
  { id: 'spectrum', label: '성향 선택' },
  { id: 'feedback', label: '후기 작성' },
] as const satisfies readonly StepIndicatorStep[];

export type ReviewStepId = (typeof REVIEW_STEPS)[number]['id'];

export const REVIEW_MAX_TAGS = 3;

/** 스펙트럼 슬라이더 핸들 위치 수. 중앙 위치는 초기 중립 상태로만 사용한다. */
export const REVIEW_SPECTRUM_STEP_COUNT = 7;

/** 스펙트럼 슬라이더 초기 단계 (0~6 중 중앙) */
export const REVIEW_DEFAULT_SPECTRUM_STEP = 3;

export const REVIEW_FEEDBACK_MIN_LENGTH = 10;

export const REVIEW_FEEDBACK_MAX_LENGTH = 250;

/** 후기 작성 단계에서 노출되는 작성 가이드 */
export const REVIEW_FEEDBACK_TIPS = [
  {
    text: '추상적인 표현보다 구체적인 상황을 담아주세요.',
    examplePrefix: 'ex) ',
    example: '"의견이 갈릴 때마다 양쪽 입장을 정리해줘서 회의가 매끄럽게 진행됐어요."',
  },
  {
    text: '협업하며 느낀 강점을 작성해주세요.',
    examplePrefix: 'ex) ',
    example: '"마감이 촉박한 상황에서도 책임있게 업무를 완수했어요."',
  },
  {
    text: '솔직하지만 다음에 더 나아질 수 있는 방향으로 적어주세요.',
    examplePrefix: '예) ',
    example: '"일정 공유를 조금만 더 자주 해줬다면 좋았을 것 같아요."',
  },
] as const;
