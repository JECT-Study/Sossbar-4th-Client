'use client';

import { ConfirmationDialog } from '@/shared/components/dialog/confirmation-dialog';

type ProjectInviteAcceptModalProps = {
  open: boolean;
  projectName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isConfirming?: boolean;
  errorMessage?: string;
};

export const ProjectInviteAcceptModal = ({
  open,
  projectName,
  onOpenChange,
  onConfirm,
  isConfirming = false,
  errorMessage,
}: ProjectInviteAcceptModalProps) => (
  <ConfirmationDialog
    open={open}
    title="후기 작성"
    description={
      <>
        <span className="text-text-basic font-bold">{projectName}</span> 후기 작성에 참여하시겠습니까?
      </>
    }
    confirmText="참여하기"
    cancelText="취소"
    onOpenChange={onOpenChange}
    onConfirm={onConfirm}
    isConfirming={isConfirming}
    errorMessage={errorMessage}
  />
);
