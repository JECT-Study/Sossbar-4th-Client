import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchReceivedTagsByProject } from '../api/fetch-received-tags-by-project.api';
import { fetchReceivedTags } from '../api/fetch-received-tags.api';
import { tagKeys } from '../tag.query-key';

type Params = {
  userId: number;
  projectId?: number;
};

export const useReceivedTags = ({ userId, projectId }: Params) =>
  useSuspenseQuery({
    queryKey: tagKeys.received(userId, projectId),
    queryFn: () =>
      projectId === undefined ? fetchReceivedTags(userId) : fetchReceivedTagsByProject(userId, projectId),
  });
