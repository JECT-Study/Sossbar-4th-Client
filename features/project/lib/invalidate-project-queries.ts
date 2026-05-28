import type { QueryClient } from '@tanstack/react-query';

import { projectKeys } from '../api/query-keys';

/** 프로젝트 목록·프로필 탭 등 목록성 쿼리 갱신 */
export const invalidateProjectListQueries = (queryClient: QueryClient, userId?: number) => {
  void queryClient.invalidateQueries({ queryKey: projectKeys.list() });

  if (userId != null && userId > 0) {
    void queryClient.invalidateQueries({ queryKey: projectKeys.byUser(userId) });
  }
};
