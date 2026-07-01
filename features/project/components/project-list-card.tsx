'use client';

import { EmptyState } from '@/shared/components/empty-state';

import type { FetchMyProjectsParams } from '../project.types';

import { ProjectCard } from './project-card';
import { useMyProjectCards } from '../project.hooks';

interface Props {
  params: FetchMyProjectsParams;
}

export const ProjectListCard = ({ params }: Props) => {
  const projects = useMyProjectCards(params);

  if (projects.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <EmptyState title="참여 중인 프로젝트가 없어요" />
      </div>
    );
  }

  return (
    <>
      {projects.map((project) => (
        <ProjectCard key={project.projectId} project={project} />
      ))}
    </>
  );
};
