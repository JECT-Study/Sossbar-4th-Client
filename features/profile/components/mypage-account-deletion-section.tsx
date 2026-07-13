'use client';

import { AccountDeletionModal } from '@/features/auth';
import { ArrowRightIcon } from '@/shared/assets/icons';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';

export const MypageAccountDeletionSection = () => {
  const [isDeletionOpen, openDeletion, closeDeletion] = useBooleanState(false);

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openDeletion}
          className="text-body-base text-text-subtle hover:bg-button-tertiary-fill-hover inline-flex h-10 items-center rounded-md px-2 font-medium transition-colors"
        >
          회원 탈퇴
          <ArrowRightIcon aria-hidden className="size-[18px]" />
        </button>
      </div>

      <AccountDeletionModal open={isDeletionOpen} onOpenChange={(next) => (next ? openDeletion() : closeDeletion())} />
    </>
  );
};
