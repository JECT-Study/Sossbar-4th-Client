'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchReceivedTags, fetchReceivedTagsByProject, tagKeys } from './tag.api';

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
