'use client';

import { ProjectPageContent } from './project-page-content';

type Props = {
  userLink: string;
  projectId: number;
};

export const ProjectPageClientWrapper = ({ userLink, projectId }: Props) => (
  <ProjectPageContent userLink={userLink} projectId={projectId} />
);
