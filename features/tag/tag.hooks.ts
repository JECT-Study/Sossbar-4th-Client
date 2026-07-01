'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useId, useState } from 'react';

import { fetchReceivedTags, fetchReceivedTagsByProject } from './tag.api';
import { tagKeys } from './tag.query-keys';

interface UseReceivedTagsParams {
  userLink: string;
  projectId?: number;
}

export const useReceivedTags = ({ userLink, projectId }: UseReceivedTagsParams) =>
  useSuspenseQuery({
    queryKey: tagKeys.received(userLink, projectId),
    queryFn: () =>
      projectId === undefined ? fetchReceivedTags(userLink) : fetchReceivedTagsByProject(userLink, projectId),
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
