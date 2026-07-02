'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Dialog } from 'radix-ui';

import { cn } from '@/shared/lib/cn';

interface DialogAnimatedOverlayProps {
  className?: string;
}

export const DialogAnimatedOverlay = ({ className }: DialogAnimatedOverlayProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Dialog.Overlay asChild forceMount>
      <motion.div
        className={cn('bg-black-75 fixed inset-0 z-50', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
      />
    </Dialog.Overlay>
  );
};
