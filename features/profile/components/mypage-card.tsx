import type { ReactNode } from 'react';

import { Button } from '@/shared/components/button';
import { SectionCard } from '@/shared/components/section-card';

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
  const action = isEditing ? (
    <div className="flex gap-2">
      <Button type="button" variant="tertiary" onClick={onCancel} disabled={isSaving} className="text-text-basic">
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
  );

  return (
    <SectionCard title={title} action={action} headerClassName="bg-surface-white sticky top-[61px] z-10 lg:static">
      {children}
    </SectionCard>
  );
};
