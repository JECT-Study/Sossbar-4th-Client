import { useCallback } from 'react';

import { useBooleanState } from '@/shared/hooks/use-boolean-state';

import type { UpdateProfilePayload } from '../types';

import { useUpdateProfile } from './use-update-profile.mutation';

export const useProfileEditing = () => {
  const [isEditing, startEditing, stopEditing] = useBooleanState(false);
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();

  const submitProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      await updateProfile(payload);
      stopEditing();
    },
    [stopEditing, updateProfile],
  );

  return {
    isEditing,
    isUpdatingProfile,
    startEditing,
    stopEditing,
    submitProfile,
  };
};
