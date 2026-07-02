import type { StepIndicatorStep } from '@/shared/components/step-indicator';

export const REVIEW_STEPS = [
  { id: 'tag', label: '태그 선택' },
  { id: 'spectrum', label: '성향 선택' },
  { id: 'feedback', label: '후기 작성' },
] as const satisfies readonly StepIndicatorStep[];

export type ReviewStepId = (typeof REVIEW_STEPS)[number]['id'];

export const REVIEW_MAX_TAGS = 3;

/** 스펙트럼 슬라이더 단계 수 (백엔드 강도 1~6에 대응) */
export const REVIEW_SPECTRUM_STEP_COUNT = 6;

/** 스펙트럼 슬라이더 초기 단계 (0~5 중 중앙) */
export const REVIEW_DEFAULT_SPECTRUM_STEP = 2;

export const REVIEW_FEEDBACK_MIN_LENGTH = 10;

export const REVIEW_FEEDBACK_MAX_LENGTH = 250;

/** 후기 작성 단계에서 노출되는 작성 가이드 */
export const REVIEW_FEEDBACK_TIPS = [
  {
    text: '추상적인 표현보다 구체적인 상황을 담아주세요.',
    example: '"의견이 갈릴 때마다 양쪽 입장을 정리해줘서 논의가 매끄럽게 진행됐어요."',
  },
  {
    text: '협업하며 느낀 강점을 알려주세요.',
    example: '"마감이 촉박한 상황에서도 끝까지 책임지고 자기 파트를 완성했어요."',
  },
  {
    text: '솔직하지만 다음에 더 나아질 수 있는 방향으로 적어주세요.',
    example: '"일정 공유를 조금만 더 자주 해줬다면 좋았을 것 같아요."',
  },
] as const;
