import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateProjectPayload, UpdateProjectPayload } from '@/features/project/types';

import {
  confirmProjectMembers,
  createProject,
  deleteProject,
  deleteProjectMember,
  inviteProjectMember,
  updateProject,
} from './fetchers';
import { projectKeys } from './query-keys';

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(projectKeys.detail(data.projectId), data);
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
};

export const useUpdateProject = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProjectPayload) => updateProject(projectId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(projectKeys.detail(data.projectId), data);
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),
    onSuccess: (_data, projectId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
};

export const useInviteProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => inviteProjectMember(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
    },
  });
};

export const useDeleteProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => deleteProjectMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
};

export const useConfirmProjectMembers = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => confirmProjectMembers(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
};
