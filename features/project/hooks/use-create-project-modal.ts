import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import { ApiError } from '@/shared/lib/api';

import type { CreateProjectFormValues } from './use-create-project-form';

import { useCreateProjectForm } from './use-create-project-form';
import { useCreateProject } from './use-create-project.mutation';
import { buildProjectInviteUrl } from '../lib/build-project-invite-url';

interface Params {
  onOpenChange: (open: boolean) => void;
}

export const useCreateProjectModal = ({ onOpenChange }: Params) => {
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: myProfile } = useMyProfile();
  const { mutateAsync: createProject, isPending: isSubmitting } = useCreateProject();
  const { form, resetForm } = useCreateProjectForm();

  const clearCopyResetTimer = useCallback(() => {
    if (copyResetTimerRef.current !== null) {
      clearTimeout(copyResetTimerRef.current);
      copyResetTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearCopyResetTimer;
  }, [clearCopyResetTimer]);

  const inviteUrl = useMemo(
    () => (createdProjectId !== null ? buildProjectInviteUrl(createdProjectId, myProfile?.username) : ''),
    [createdProjectId, myProfile?.username],
  );

  const resetAll = useCallback(() => {
    resetForm();
    setCreatedProjectId(null);
    setLinkCopied(false);
    clearCopyResetTimer();
  }, [clearCopyResetTimer, resetForm]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        resetAll();
      }
      onOpenChange(next);
    },
    [onOpenChange, resetAll],
  );

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(inviteUrl).then(() => {
      setLinkCopied(true);
      clearCopyResetTimer();
      copyResetTimerRef.current = setTimeout(() => {
        setLinkCopied(false);
        copyResetTimerRef.current = null;
      }, 3000);
    });
  };

  const onSubmit = async (data: CreateProjectFormValues) => {
    try {
      form.clearErrors('root');
      const createdProject = await createProject({
        request: {
          projectName: data.projectName.trim(),
          host: data.host.trim(),
        },
        image: data.image,
      });

      setCreatedProjectId(createdProject.projectId);
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof ApiError ? error.message : '프로젝트 생성 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
      });
    }
  };

  return {
    createdProjectId,
    form,
    handleCopyLink,
    handleOpenChange,
    inviteUrl,
    isSubmitting,
    linkCopied,
    onSubmit,
  };
};
