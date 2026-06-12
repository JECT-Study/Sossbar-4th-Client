import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import type { ProjectPayload } from '@/features/project/types';

import { createProject } from '../api/create-project.api';
import { projectKeys } from '../api/query-keys';
import { invalidateProjectListQueries } from '../lib/invalidate-project-queries';

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: (payload: ProjectPayload) => createProject(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(projectKeys.detail(data.projectId), data);
      invalidateProjectListQueries(queryClient, profile?.userId);
    },
  });
};
