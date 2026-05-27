import { useQuery } from '@tanstack/react-query';

import { fetchProject, fetchProjects } from './fetchers';

export const projectKeys = {
  all: ['project'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  detail: (projectId: number) => [...projectKeys.all, 'detail', projectId] as const,
};

export const useProjects = (enabled = true) =>
  useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
    enabled,
  });

export const useProject = (projectId: number, enabled = true) =>
  useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => fetchProject(projectId),
    enabled: enabled && projectId > 0,
  });
