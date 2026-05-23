import { useQuery } from '@tanstack/react-query';

import { fetchProject } from './fetchers';

export const projectKeys = {
  all: ['project'] as const,
  detail: (projectId: number) => [...projectKeys.all, 'detail', projectId] as const,
};

export const useProject = (projectId: number, enabled = true) =>
  useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => fetchProject(projectId),
    enabled: enabled && projectId > 0,
  });
