import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import type { ProjectPayload } from '@/features/project/types';

import { projectKeys } from '../api/query-keys';
import { updateProject } from '../api/update-project.api';
import { invalidateProjectListQueries } from '../lib/invalidate-project-queries';

export const useUpdateProject = (projectId: number) => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: (payload: ProjectPayload) => updateProject(projectId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(projectKeys.detail(data.projectId), data);
      invalidateProjectListQueries(queryClient, profile?.userId);
    },
  });
};
