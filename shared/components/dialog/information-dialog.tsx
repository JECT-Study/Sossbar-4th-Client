import type { ReactElement, ReactNode } from 'react';

import { Dialog } from 'radix-ui';

import { DialogAnimatedPortal } from './dialog-animated-portal';
import { Button } from '../button/button';

interface Props {
  title: ReactNode;
  description: ReactNode;
  confirmText: ReactNode;
  icon?: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const InformationDialog = ({ title, description, confirmText, icon, open, onOpenChange, onConfirm }: Props) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <DialogAnimatedPortal
        open={open}
        className="fixed top-1/2 left-1/2 flex w-[360px] flex-col items-center gap-4 rounded-lg bg-white p-6 text-center"
      >
        {icon ? <div className="flex items-center justify-center">{icon}</div> : null}
        <div className="flex flex-col gap-2">
          <Dialog.Title className="text-heading-base font-bold">{title}</Dialog.Title>
          <Dialog.Description className="text-body-base text-text-subtle">{description}</Dialog.Description>
        </div>
        <Button variant="primary" className="w-full" onClick={onConfirm}>
          {confirmText}
        </Button>
      </DialogAnimatedPortal>
    </Dialog.Root>
  );
};
