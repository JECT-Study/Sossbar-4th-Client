import { useQuery } from '@tanstack/react-query';

import { fetchProject, fetchUserProjects } from './fetchers';
import { projectKeys } from './query-keys';

export const useProject = (projectId: number, enabled = true) =>
  useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => fetchProject(projectId),
    enabled: enabled && projectId > 0,
  });

export const useUserProjects = (userId: number) =>
  useQuery({
    queryKey: projectKeys.byUser(userId),
    queryFn: () => fetchUserProjects(userId),
    enabled: userId > 0,
  });
