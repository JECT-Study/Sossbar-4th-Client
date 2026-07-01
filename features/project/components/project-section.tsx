'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { EmptyState } from '@/shared/components/empty-state';
import { SortDropdown, type SortOrder } from '@/shared/components/sort-dropdown';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

import type { UserProjectResponse } from '../project.types';

import { useUserProjects } from '../project.hooks';

const INITIAL_COUNT = 8;

const DEFAULT_IMAGE_PATH = '/default.png';

interface ProjectItemProps {
  userLink: string;
  project: UserProjectResponse;
}

const ProjectItem = ({ userLink, project }: ProjectItemProps) => {
  return (
    <Link
      href={ROUTES.PROJECT(userLink, project.projectId)}
      className="focus-visible:ring-border-secondary block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
    >
      <article className="flex flex-col gap-4 pb-4">
        <div className="relative aspect-[72/54] w-full overflow-hidden rounded-lg">
          <Image
            src={project.projectImage ?? DEFAULT_IMAGE_PATH}
            alt="프로젝트 이미지"
            fill
            sizes="(min-width: 1024px) 282px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-heading-xs text-text-subtle truncate font-bold">{project.projectName}</h3>
          <p className="text-body-sm text-text-subtler truncate font-medium">
            {[project.host, formatIsoDateToDots(project.startDate)].filter(Boolean).join(' · ')}
          </p>
        </div>
      </article>
    </Link>
  );
};

interface ProjectSectionProps {
  userLink: string;
}

const sortProjects = (projects: UserProjectResponse[], sortOrder: SortOrder) =>
  projects.toSorted((a, b) => {
    const [left, right] = sortOrder === 'latest' ? [b.startDate, a.startDate] : [a.startDate, b.startDate];
    return (left ?? '').localeCompare(right ?? '');
  });

export const ProjectSection = ({ userLink }: ProjectSectionProps) => {
  const { data: projects, isPending, isError } = useUserProjects(userLink);
  const [showAll, setShowAll] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOrder>('latest');

  const sortedProjects = useMemo(
    () => (projects ? sortProjects(projects, selectedSort) : []),
    [projects, selectedSort],
  );

  if (isPending) {
    return <p className="text-body-sm text-text-subtle">프로젝트 정보를 불러오는 중...</p>;
  }

  if (isError) {
    return <p className="text-body-sm text-text-error">프로젝트 정보를 불러오지 못했습니다.</p>;
  }

  if (projects.length === 0) {
    return (
      <section
        aria-label="프로젝트별 리뷰"
        className="border-border-gray flex min-h-136 flex-col overflow-hidden rounded-2xl border"
      >
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyState title="등록된 프로젝트가 없어요" />
        </div>
      </section>
    );
  }

  const visibleProjects = showAll ? sortedProjects : sortedProjects.slice(0, INITIAL_COUNT);
  const hasMore = !showAll && sortedProjects.length > INITIAL_COUNT;

  return (
    <section
      aria-label="프로젝트별 리뷰"
      className={cn('border-border-gray flex flex-col overflow-hidden rounded-2xl border bg-white')}
    >
      <header className="bg-surface-gray-subtler border-border-gray flex items-center justify-end border-b px-8 py-5">
        <SortDropdown
          value={selectedSort}
          onValueChange={setSelectedSort}
          ariaLabel="프로젝트 정렬"
          triggerClassName="h-[30px]"
        />
      </header>

      <div className="flex flex-col gap-[30px] p-6">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProjects.map((project) => (
            <li key={project.projectId}>
              <ProjectItem userLink={userLink} project={project} />
            </li>
          ))}
        </ul>

        {hasMore ? (
          <Button
            variant="tertiary"
            size="large"
            rightIcon={<DownIcon className="size-6" aria-hidden />}
            className="text-body-xl h-[58px] w-full rounded-lg px-7"
            onClick={() => setShowAll(true)}
          >
            프로젝트 더보기
          </Button>
        ) : null}
      </div>
    </section>
  );
};
