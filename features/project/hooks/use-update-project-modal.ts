import { useCallback } from 'react';

import { ApiError } from '@/shared/lib/api';

import type { ProjectRequest } from '../types';
import type { UpdateProjectFormValues } from './use-update-project-form';

import { useUpdateProjectForm } from './use-update-project-form';
import { useUpdateProject } from './use-update-project.mutation';

interface Params {
  projectId: number;
  defaultProjectValues: ProjectRequest;
  onOpenChange: (open: boolean) => void;
}

export const useUpdateProjectModal = ({ projectId, defaultProjectValues, onOpenChange }: Params) => {
  const { mutateAsync: updateProject, isPending: isSubmitting } = useUpdateProject(projectId);
  const { form, resetForm } = useUpdateProjectForm({ defaultProjectValues });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        resetForm();
      }
      onOpenChange(next);
    },
    [onOpenChange, resetForm],
  );

  const onSubmit = async (data: UpdateProjectFormValues) => {
    try {
      form.clearErrors('root');
      await updateProject({
        request: {
          projectName: data.projectName.trim(),
          host: data.host.trim(),
        },
        image: data.image,
      });

      onOpenChange(false);
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof ApiError ? error.message : '프로젝트 수정 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
      });
    }
  };

  return {
    form,
    handleOpenChange,
    isSubmitting,
    onSubmit,
  };
};
