import { useQuery } from '@tanstack/react-query';

import { fetchProject, fetchProjects, fetchUserProjects } from './fetchers';
import { projectKeys } from './query-keys';

export const useProjects = (enabled = true) =>
  useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
    enabled,
  });

export const useProject = (projectId: number, enabled = true, options?: { throwOnError?: boolean }) =>
  useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => fetchProject(projectId),
    enabled: enabled && projectId > 0,
    ...options,
  });

export const useUserProjects = (userId: number) =>
  useQuery({
    queryKey: projectKeys.byUser(userId),
    queryFn: () => fetchUserProjects(userId),
    enabled: userId > 0,
  });
