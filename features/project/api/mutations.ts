import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';

import { confirmProjectMembers, deleteProject, deleteProjectMember, inviteProjectMember } from './fetchers';
import { projectKeys } from './query-keys';
import { invalidateProjectListQueries } from '../lib/invalidate-project-queries';

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),
    onSuccess: (_data, projectId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, profile?.userId);
    },
  });
};

export const useInviteProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: () => inviteProjectMember(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, profile?.userId);
    },
  });
};

export const useDeleteProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: (userId: number) => deleteProjectMember(projectId, userId),
    onSuccess: (_data, removedUserId) => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, profile?.userId);
      if (removedUserId > 0) {
        void queryClient.invalidateQueries({ queryKey: projectKeys.byUser(removedUserId) });
      }
    },
  });
};

export const useConfirmProjectMembers = (projectId: number) => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: () => confirmProjectMembers(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, profile?.userId);
    },
  });
};
