import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { TagCardBoundary } from './tag-card-boundary';
import { fetchReceivedTags, fetchReceivedTagsByProject } from '../tag.api';
import { tagKeys } from '../tag.query-keys';

interface Props {
  userId: number;
  projectId?: number;
  collapsible?: boolean;
}

export const TagCardStream = async ({ userId, projectId, collapsible }: Props) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: tagKeys.received(userId, projectId),
    queryFn: () =>
      projectId === undefined ? fetchReceivedTags(userId) : fetchReceivedTagsByProject(userId, projectId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TagCardBoundary userId={userId} projectId={projectId} collapsible={collapsible} />
    </HydrationBoundary>
  );
};
