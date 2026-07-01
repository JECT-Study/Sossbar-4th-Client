'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useId, useState } from 'react';

import { fetchReceivedTags, fetchReceivedTagsByProject } from './tag.api';
import { tagKeys } from './tag.query-keys';

interface UseReceivedTagsParams {
  userId: number;
  projectId?: number;
}

export const useReceivedTags = ({ userId, projectId }: UseReceivedTagsParams) =>
  useSuspenseQuery({
    queryKey: tagKeys.received(userId, projectId),
    queryFn: () =>
      projectId === undefined ? fetchReceivedTags(userId) : fetchReceivedTagsByProject(userId, projectId),
  });

export const useTagCollapsible = (defaultCollapsed = false) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const contentId = useId();
  return {
    isCollapsed,
    contentId,
    toggle: () => setIsCollapsed((prev) => !prev),
  };
};
