'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { AnimatePresence } from 'motion/react';
import { Dialog } from 'radix-ui';

import { DialogAnimatedContent } from './dialog-content';
import { DialogAnimatedOverlay } from './dialog-overlay';

interface DialogAnimatedPortalProps extends Omit<ComponentPropsWithoutRef<typeof Dialog.Content>, 'children'> {
  open: boolean;
  overlayClassName?: string;
  children: ReactNode;
}

export const DialogAnimatedPortal = ({
  open,
  overlayClassName,
  className,
  children,
  ...contentProps
}: DialogAnimatedPortalProps) => {
  return (
    <AnimatePresence>
      {!!open && (
        <Dialog.Portal forceMount>
          <DialogAnimatedOverlay className={overlayClassName} />
          <DialogAnimatedContent className={className} {...contentProps}>
            {children}
          </DialogAnimatedContent>
        </Dialog.Portal>
      )}
    </AnimatePresence>
  );
};
