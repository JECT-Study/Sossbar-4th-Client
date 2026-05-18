'use client';

import Image from 'next/image';
import Link from 'next/link';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { ROUTES } from '@/shared/constants/routes';

const createProjects = (userId: string) =>
  Array.from({ length: 8 }, (_, index) => ({
    id: `hackathon-project-${index + 1}`,
    title: '2024 해커톤 프로젝트',
    description: '테크 스타트업 캠퍼니 · 2025.07.10',
    thumbnailSrc: '/default.png',
    href: ROUTES.PROFILE(userId),
  }));

type Project = ReturnType<typeof createProjects>[number];

interface ProjectItemProps {
  project: Project;
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  return (
    <Link
      href={project.href}
      className="focus-visible:ring-border-secondary block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
    >
      <article>
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg">
          <Image
            src={project.thumbnailSrc}
            alt=""
            fill
            sizes="(min-width: 1024px) 282px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <h3 className="text-heading-xs text-text-subtle mt-4 font-bold">{project.title}</h3>
        <p className="text-body-sm text-text-subtler mt-1 font-medium">{project.description}</p>
      </article>
    </Link>
  );
};

type ProjectSectionProps = {
  userId: string;
};

export const ProjectSection = ({ userId }: ProjectSectionProps) => {
  const projects = createProjects(userId);

  return (
    <section aria-label="프로젝트별 리뷰" className="flex flex-col">
      <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <li key={project.id}>
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
