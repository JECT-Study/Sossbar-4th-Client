import { HydrationBoundary } from '@tanstack/react-query';

import type { DehydratedState } from '@tanstack/react-query';

import { ProjectPageClientWrapper } from './project-page-client-wrapper';

interface Props {
  userId: number;
  projectId: number;
  state: DehydratedState;
}

export const ProjectDetailStream = ({ userId, projectId, state }: Props) => (
  <HydrationBoundary state={state}>
    <ProjectPageClientWrapper userId={userId} projectId={projectId} />
  </HydrationBoundary>
);
