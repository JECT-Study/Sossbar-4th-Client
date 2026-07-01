import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { TagCardGate } from './tag-card-gate';
import { fetchReceivedTags, fetchReceivedTagsByProject, tagKeys } from '../tag.api';

interface Props {
  userLink: string;
  projectId?: number;
  collapsible?: boolean;
}

export const TagCardEntry = async ({ userLink, projectId, collapsible }: Props) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: tagKeys.received(userLink, projectId),
    queryFn: () =>
      projectId === undefined ? fetchReceivedTags(userLink) : fetchReceivedTagsByProject(userLink, projectId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TagCardGate userLink={userLink} projectId={projectId} collapsible={collapsible} />
    </HydrationBoundary>
  );
};
