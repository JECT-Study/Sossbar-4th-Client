'use client';

import { Dialog } from 'radix-ui';

import { Button } from '@/shared/components/button';

import { AccountDeletionCompleteModal } from './account-deletion-complete-modal';
import { AccountDeletionFields } from './account-deletion-fields';
import { useAccountDeletionController } from '../hooks/use-account-deletion-controller';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccountDeletionModal = ({ open, onOpenChange }: Props) => {
  const { form, isDetailEnabled, canSubmit, completeOpen, setCompleteOpen, handleFormSubmit } =
    useAccountDeletionController({
      open,
      onOpenChange,
    });

  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
          <Dialog.Content className="border-border-gray bg-surface-white fixed top-1/2 left-1/2 z-50 flex h-[min(680px,calc(100vh-48px))] w-[min(592px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border p-10 shadow-xl">
            <form onSubmit={handleFormSubmit} className="flex min-h-0 flex-1 flex-col gap-6">
              <div className="flex shrink-0 flex-col gap-2">
                <Dialog.Title className="text-heading-base text-text-basic font-bold tracking-normal">
                  회원 탈퇴
                </Dialog.Title>
                <Dialog.Description className="text-body-base text-text-subtle leading-normal font-normal">
                  Sossbar를 떠나는 이유를 알려주세요
                </Dialog.Description>
              </div>

              <AccountDeletionFields
                control={control}
                register={register}
                isDetailEnabled={isDetailEnabled}
                detailErrorMessage={errors.detail?.message}
              />

              {errors.root ? <p className="text-body-sm text-text-error shrink-0">{errors.root.message}</p> : null}

              <div className="flex shrink-0 justify-end gap-2">
                <Button
                  type="button"
                  variant="tertiary"
                  size="medium"
                  className="h-11 min-w-[68px]"
                  onClick={() => onOpenChange(false)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  className="h-11 min-w-[68px]"
                  disabled={!canSubmit}
                >
                  제출하기
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <AccountDeletionCompleteModal open={completeOpen} onOpenChange={setCompleteOpen} />
    </>
  );
};
