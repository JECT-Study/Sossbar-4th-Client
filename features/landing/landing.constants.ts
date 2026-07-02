import type { Variants } from 'motion/react';

// 랜딩 스크롤 리빌 모션 토큰 (단일 출처)
export const EASE = 'easeIn' as const;
export const REVEAL_DURATION_S = 0.3;
export const REVEAL_OFFSET_Y = 24;
export const STAGGER_S = 0.18;

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_S },
  },
};
