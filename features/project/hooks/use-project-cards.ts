'use client';

import { useMemo } from 'react';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import { useProjects } from '@/features/project/api/queries';
import { mapMyProjectsToCardItems } from '@/features/project/lib/map-my-project-to-card';
import type { ProjectCardItem } from '@/features/project/types';

type UseProjectCardsResult = {
  projects: ProjectCardItem[];
  hasSession: boolean;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  refetch: ReturnType<typeof useProjects>['refetch'];
};

export const useProjectCards = (): UseProjectCardsResult => {
  const { data: profile } = useMyProfile();
  const hasSession = profile != null;
  const query = useProjects(hasSession);

  const projects = useMemo(() => {
    if (!query.data || !profile) {
      return [];
    }
    return mapMyProjectsToCardItems(query.data, { userId: profile.userId, nickname: profile.username ?? '' });
  }, [query.data, profile]);

  return {
    projects,
    hasSession,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
