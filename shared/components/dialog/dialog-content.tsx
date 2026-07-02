'use client';

import type { ComponentPropsWithoutRef } from 'react';

import { motion, useReducedMotion } from 'motion/react';
import { Dialog } from 'radix-ui';

type DialogAnimatedContentProps = ComponentPropsWithoutRef<typeof Dialog.Content>;

export const DialogAnimatedContent = ({ className, children, ...restProps }: DialogAnimatedContentProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Dialog.Content asChild forceMount {...restProps}>
      <motion.div
        className={className}
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96, x: '-50%', y: '-50%' }}
        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
        exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96, x: '-50%', y: '-50%' }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </Dialog.Content>
  );
};
