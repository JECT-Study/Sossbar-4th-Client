'use client';

import { ProjectPageContent } from './project-page-content';

type Props = {
  userId: number;
  projectId: number;
};

export const ProjectPageClientWrapper = ({ userId, projectId }: Props) => (
  <ProjectPageContent userId={userId} projectId={projectId} />
);
