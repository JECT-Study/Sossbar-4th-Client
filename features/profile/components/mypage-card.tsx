import type { ReactNode } from 'react';

import { Button } from '@/shared/components/button';

interface Props {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  children: ReactNode;
}

export const MypageCard = ({ title, isEditing, onEdit, onCancel, onSave, isSaving = false, children }: Props) => {
  return (
    <section className="border-border-gray bg-surface-white flex justify-between rounded-2xl border p-8">
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-row items-center justify-between gap-4">
          <h2 className="text-heading-sm text-text-basic font-bold">{title}</h2>
          <div className="flex shrink-0 justify-end">
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={onCancel}
                  disabled={isSaving}
                  className="text-text-basic"
                >
                  취소
                </Button>
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={onSave}
                  disabled={isSaving}
                  className="border-border-gray-dark text-text-basic border"
                >
                  저장
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="tertiary"
                onClick={onEdit}
                className="border-border-gray-dark text-text-subtle border"
              >
                설정
              </Button>
            )}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
};
