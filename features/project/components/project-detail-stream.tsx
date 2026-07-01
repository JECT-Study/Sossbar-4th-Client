import { HydrationBoundary } from '@tanstack/react-query';

import type { DehydratedState } from '@tanstack/react-query';

import { ProjectPageClientWrapper } from './project-page-client-wrapper';

interface Props {
  userId: number;
  userLink: string;
  projectId: number;
  state: DehydratedState;
}

export const ProjectDetailStream = ({ userId, userLink, projectId, state }: Props) => (
  <HydrationBoundary state={state}>
    <ProjectPageClientWrapper userId={userId} userLink={userLink} projectId={projectId} />
  </HydrationBoundary>
);
