'use client';

import { useState } from 'react';

import { SectionInfoRow } from '@/shared/components/section-card';
import { Toggle } from '@/shared/components/toggle';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';

import { MypageCard } from './mypage-card';

export const MypageAlertSection = () => {
  const [isEditing, startEditing, stopEditing] = useBooleanState(false);

  const [alertOn, setAlertOn] = useState(true);
  const [committedAlertOn, setCommittedAlertOn] = useState(true);

  const handleEdit = () => {
    setAlertOn(committedAlertOn);
    startEditing();
  };

  const handleCancel = () => {
    setAlertOn(committedAlertOn);
    stopEditing();
  };

  const handleSave = () => {
    setCommittedAlertOn(alertOn);
    stopEditing();
  };

  return (
    <MypageCard title="알림 설정" isEditing={isEditing} onEdit={handleEdit} onCancel={handleCancel} onSave={handleSave}>
      <SectionInfoRow label="알림 수신">
        {isEditing ? (
          <Toggle checked={alertOn} onCheckedChange={setAlertOn} aria-label="알림 수신" />
        ) : (
          <span className="text-text-basic text-body-base">{committedAlertOn ? 'ON' : 'OFF'}</span>
        )}
      </SectionInfoRow>
    </MypageCard>
  );
};
