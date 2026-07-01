import { HydrationBoundary } from '@tanstack/react-query';

import type { DehydratedState } from '@tanstack/react-query';

import { ProjectFeedbackPageContent } from './project-feedback-page-content';

interface Props {
  userLink: string;
  projectId: number;
  state: DehydratedState;
}

export const ProjectFeedbackStream = ({ userLink, projectId, state }: Props) => (
  <HydrationBoundary state={state}>
    <ProjectFeedbackPageContent userLink={userLink} projectId={projectId} />
  </HydrationBoundary>
);
