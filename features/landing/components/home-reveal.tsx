'use client';

import { motion, useReducedMotion } from 'motion/react';

import type { HTMLMotionProps, Variants } from 'motion/react';

import { EASE, REVEAL_DURATION_S, REVEAL_OFFSET_Y, staggerContainerVariants } from '../landing.constants';

interface HomeRevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
  amount?: number;
}

// 단일 요소 스크롤 리빌 (섹션 헤더, 히어로 블록, CTA 등)
export const HomeReveal = ({ delay = 0, amount = 0.2, children, ...restProps }: HomeRevealProps) => {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : REVEAL_OFFSET_Y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: REVEAL_DURATION_S, ease: EASE, delay },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      {...restProps}
    >
      {children}
    </motion.div>
  );
};

interface HomeRevealGroupProps extends HTMLMotionProps<'div'> {
  amount?: number;
}

// 스태거 컨테이너 (그리드/리스트 래퍼) — 직계 자식의 등장을 순차 orchestration
export const HomeRevealGroup = ({ amount = 0.2, children, ...restProps }: HomeRevealGroupProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={staggerContainerVariants}
      {...restProps}
    >
      {children}
    </motion.div>
  );
};

type HomeRevealItemProps = HTMLMotionProps<'div'>;

// 스태거 아이템 — 부모(HomeRevealGroup)의 visible/hidden 상태를 상속
export const HomeRevealItem = ({ children, ...restProps }: HomeRevealItemProps) => {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : REVEAL_OFFSET_Y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: REVEAL_DURATION_S, ease: EASE },
    },
  };

  return (
    <motion.div variants={variants} {...restProps}>
      {children}
    </motion.div>
  );
};
