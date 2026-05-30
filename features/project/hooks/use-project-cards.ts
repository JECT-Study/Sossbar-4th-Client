'use client';

import { useMemo } from 'react';

import { useProjects } from '@/features/project/api/queries';
import { mapMyProjectsToCardItems } from '@/features/project/lib/map-my-project-to-card';
import type { ProjectCardItem } from '@/features/project/types';
import { useSessionUser } from '@/shared/lib/session-user';

type UseProjectCardsResult = {
  projects: ProjectCardItem[];
  hasSession: boolean;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  refetch: ReturnType<typeof useProjects>['refetch'];
};

/** 2단계 `/projects` 화면용: 목록 조회 + 카드 UI 매핑 */
export const useProjectCards = (): UseProjectCardsResult => {
  const sessionUser = useSessionUser();
  const sessionUserId = sessionUser?.userId;
  const hasSession = sessionUserId != null && sessionUserId > 0;
  const query = useProjects(hasSession);

  const projects = useMemo(() => {
    if (!query.data || !sessionUser) {
      return [];
    }
    return mapMyProjectsToCardItems(query.data, sessionUser);
  }, [query.data, sessionUser]);

  return {
    projects,
    hasSession,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
