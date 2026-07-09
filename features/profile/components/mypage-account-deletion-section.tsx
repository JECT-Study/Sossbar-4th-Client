'use client';

import { AccountDeletionModal } from '@/features/auth';
import { Button } from '@/shared/components/button';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';

export const MypageAccountDeletionSection = () => {
  const [isDeletionOpen, openDeletion, closeDeletion] = useBooleanState(false);

  return (
    <>
      <section className="border-border-gray bg-surface-white flex items-center justify-between rounded-2xl border p-8">
        <h2 className="text-heading-sm text-text-basic font-bold">회원 탈퇴</h2>
        <Button
          type="button"
          variant="tertiary"
          onClick={openDeletion}
          className="border-border-gray-dark text-text-subtle border"
        >
          탈퇴하기
        </Button>
      </section>

      <AccountDeletionModal open={isDeletionOpen} onOpenChange={(next) => (next ? openDeletion() : closeDeletion())} />
    </>
  );
};
