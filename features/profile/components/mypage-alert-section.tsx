'use client';

import { useState } from 'react';

import { SectionInfoRow } from '@/shared/components/section-card';
import { Toggle } from '@/shared/components/toggle';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';

import type { MyProfile } from '../profile.types';

import { useUpdateProfile } from '../profile.hooks';
import { buildUpdateProfileInfo } from '../profile.lib';
import { MypageCard } from './mypage-card';

interface Props {
  profile: MyProfile;
}

export const MypageAlertSection = ({ profile }: Props) => {
  const [isEditing, startEditing, stopEditing] = useBooleanState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [alertOn, setAlertOn] = useState(profile.marketingAgree);

  const handleEdit = () => {
    setAlertOn(profile.marketingAgree);
    startEditing();
  };

  const handleCancel = () => {
    setAlertOn(profile.marketingAgree);
    stopEditing();
  };

  const handleSave = () => {
    updateProfile(
      {
        info: buildUpdateProfileInfo(profile, { marketingAgree: alertOn }),
        profileImage: null,
      },
      { onSuccess: () => stopEditing() },
    );
  };

  return (
    <MypageCard
      title="알림 설정"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      isSaving={isPending}
    >
      <SectionInfoRow label="알림 수신">
        {isEditing ? (
          <Toggle checked={alertOn} onCheckedChange={setAlertOn} aria-label="알림 수신" />
        ) : (
          <span className="text-text-basic text-body-base">{profile.marketingAgree ? 'ON' : 'OFF'}</span>
        )}
      </SectionInfoRow>
    </MypageCard>
  );
};
