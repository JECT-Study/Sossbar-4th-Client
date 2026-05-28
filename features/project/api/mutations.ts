import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateProjectPayload, UpdateProjectPayload } from '@/features/project/types';
import { useSessionUser } from '@/shared/lib/session-user';

import {
  confirmProjectMembers,
  createProject,
  deleteProject,
  deleteProjectMember,
  inviteProjectMember,
  updateProject,
} from './fetchers';
import { projectKeys } from './query-keys';
import { invalidateProjectListQueries } from '../lib/invalidate-project-queries';

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const sessionUser = useSessionUser();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(projectKeys.detail(data.projectId), data);
      invalidateProjectListQueries(queryClient, sessionUser?.userId);
    },
  });
};

export const useUpdateProject = (projectId: number) => {
  const queryClient = useQueryClient();
  const sessionUser = useSessionUser();

  return useMutation({
    mutationFn: (payload: UpdateProjectPayload) => updateProject(projectId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(projectKeys.detail(data.projectId), data);
      invalidateProjectListQueries(queryClient, sessionUser?.userId);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const sessionUser = useSessionUser();

  return useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),
    onSuccess: (_data, projectId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, sessionUser?.userId);
    },
  });
};

export const useInviteProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  const sessionUser = useSessionUser();

  return useMutation({
    mutationFn: () => inviteProjectMember(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, sessionUser?.userId);
    },
  });
};

export const useDeleteProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  const sessionUser = useSessionUser();

  return useMutation({
    mutationFn: (userId: number) => deleteProjectMember(projectId, userId),
    onSuccess: (_data, removedUserId) => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, sessionUser?.userId);
      if (removedUserId > 0) {
        void queryClient.invalidateQueries({ queryKey: projectKeys.byUser(removedUserId) });
      }
    },
  });
};

export const useConfirmProjectMembers = (projectId: number) => {
  const queryClient = useQueryClient();
  const sessionUser = useSessionUser();

  return useMutation({
    mutationFn: () => confirmProjectMembers(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, sessionUser?.userId);
    },
  });
};
