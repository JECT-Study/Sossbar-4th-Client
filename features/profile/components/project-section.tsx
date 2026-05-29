'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { useUserProjects } from '@/features/project';
import type { UserProjectResponse } from '@/features/project';
import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { ROUTES } from '@/shared/constants/routes';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

const INITIAL_COUNT = 4;

const DEFAULT_IMAGE_PATH = '/default.png';

interface ProjectItemProps {
  userId: number;
  project: UserProjectResponse;
}

const ProjectItem = ({ userId, project }: ProjectItemProps) => {
  return (
    <Link
      href={ROUTES.PROJECT(userId, project.projectId)}
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
        <p className="text-body-sm text-text-subtler mt-1 font-medium">{`${project.host} · ${formatIsoDateToDots(project.startDate)}`}</p>
      </article>
    </Link>
  );
};

interface ProjectSectionProps {
  userId: number;
}

export const ProjectSection = ({ userId }: ProjectSectionProps) => {
  const { data: projects, isPending, isError } = useUserProjects(userId);
  const [showAll, setShowAll] = useState(false);

  if (isPending) {
    return <p className="text-body-sm text-text-subtle">프로젝트 정보를 불러오는 중...</p>;
  }

  if (isError) {
    return <p className="text-body-sm text-text-error">프로젝트 정보를 불러오지 못했습니다.</p>;
  }

  if (projects.length === 0) {
    return <p className="text-body-sm text-text-subtle">아직 참여한 프로젝트가 없습니다.</p>;
  }

  const visibleProjects = showAll ? projects : projects.slice(0, INITIAL_COUNT);
  const hasMore = !showAll && projects.length > INITIAL_COUNT;

  return (
    <section aria-label="프로젝트별 리뷰" className="flex flex-col">
      <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {visibleProjects.map((project) => (
          <li key={project.projectId}>
            <ProjectItem userId={userId} project={project} />
          </li>
        ))}
      </ul>
      {hasMore ? (
        <Button
          variant="tertiary"
          size="large"
          rightIcon={<DownIcon className="h-6 w-6" aria-hidden="true" />}
          className="mx-auto mt-16"
          onClick={() => setShowAll(true)}
        >
          프로젝트 더보기
        </Button>
      ) : null}
    </section>
  );
};
