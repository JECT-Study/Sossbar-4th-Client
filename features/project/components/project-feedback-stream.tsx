import { HydrationBoundary } from '@tanstack/react-query';

import type { DehydratedState } from '@tanstack/react-query';

import { ProjectPageClientWrapper } from './project-page-client-wrapper';

interface Props {
  userLink: string;
  projectId: number;
  state: DehydratedState;
}

export const ProjectDetailStream = ({ userLink, projectId, state }: Props) => (
  <HydrationBoundary state={state}>
    <ProjectPageClientWrapper userLink={userLink} projectId={projectId} />
  </HydrationBoundary>
);
