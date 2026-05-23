'use client';

import { ConfirmationDialog } from '@/shared/components/dialog/confirmation-dialog';

type ReviewSubmitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string;
};

export const ReviewSubmitDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
  errorMessage,
}: ReviewSubmitDialogProps) => {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isConfirming={isSubmitting}
      errorMessage={errorMessage}
      title="후기 제출"
      description={
        <>
          <p className="mb-0 leading-normal">후기를 제출 하시겠습니까?</p>
          <p className="leading-normal">제출 후 수정 및 삭제가 불가합니다.</p>
        </>
      }
      cancelText="취소"
      confirmText="제출하기"
    />
  );
};
