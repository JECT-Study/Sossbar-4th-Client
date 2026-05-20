'use client';

import Image from 'next/image';
import Link from 'next/link';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { ROUTES } from '@/shared/constants/routes';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

const DEFAULT_IMAGE_PATH = '/default.png';

// mock data
const createProjects = () => {
  return Array.from({ length: 8 }, (_, index) => ({
    projectId: index + 1,
    projectName: '소스바 프로젝트',
    host: 'JECT',
    startDate: '2025-03-01T00:00:00',
    endDate: '2025-06-30T00:00:00',
    projectImage: '/default.png',
  }));
};

type Project = ReturnType<typeof createProjects>[number];

const createProjectDescription = ({ host, startDate }: Pick<Project, 'host' | 'startDate'>) => {
  return `${host} · ${formatIsoDateToDots(startDate)}`;
};

interface ProjectItemProps {
  project: Project;
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  const description = createProjectDescription(project);

  return (
    <Link
      href={ROUTES.PROJECT(project.projectId)}
      className="focus-visible:ring-border-secondary block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
    >
      <article>
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg">
          <Image
            src={project.projectImage ?? DEFAULT_IMAGE_PATH}
            alt="프로젝트 이미지"
            fill
            sizes="(min-width: 1024px) 282px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <h3 className="text-heading-xs text-text-subtle mt-4 font-bold">{project.projectName}</h3>
        <p className="text-body-sm text-text-subtler mt-1 font-medium">{description}</p>
      </article>
    </Link>
  );
};

export const ProjectSection = () => {
  const projects = createProjects();

  return (
    <section aria-label="프로젝트별 리뷰" className="flex flex-col">
      <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <li key={project.projectId}>
            <ProjectItem project={project} />
          </li>
        ))}
      </ul>
      <Button
        variant="tertiary"
        size="large"
        rightIcon={<DownIcon className="h-6 w-6" aria-hidden="true" />}
        className="mx-auto mt-16"
      >
        프로젝트 더보기
      </Button>
    </section>
  );
};
