'use client';

import { ProjectPageContent } from './project-page-content';

type Props = {
  userId: number;
  userLink: string;
  projectId: number;
};

export const ProjectPageClientWrapper = ({ userId, userLink, projectId }: Props) => (
  <ProjectPageContent userId={userId} userLink={userLink} projectId={projectId} />
);
