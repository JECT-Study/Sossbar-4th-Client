import { HydrationBoundary } from '@tanstack/react-query';

import type { DehydratedState } from '@tanstack/react-query';

import { ProjectsPageContent } from './projects-page-content';

interface Props {
  state: DehydratedState;
}

export const ProjectsStream = ({ state }: Props) => (
  <HydrationBoundary state={state}>
    <ProjectsPageContent />
  </HydrationBoundary>
);
