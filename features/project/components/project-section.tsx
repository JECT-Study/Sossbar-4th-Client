'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useMemo, useState } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { EmptyState } from '@/shared/components/empty-state';
import { sortOptions, type SortOrder } from '@/shared/components/sort-dropdown';
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
            sizes="(min-width: 1024px) 282px, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-body-sm text-text-subtle lg:text-heading-xs truncate font-bold">{project.projectName}</h3>
          <div className="text-detail-xs flex flex-col font-medium">
            {project.host ? <p className="text-text-subtler truncate">{project.host}</p> : null}
            {project.startDate ? (
              <p className="text-text-disabled truncate">{formatIsoDateToDots(project.startDate)}</p>
            ) : null}
          </div>
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
  const { data: projects } = useUserProjects(userLink);
  const [showAll, setShowAll] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOrder>('latest');

  const sortedProjects = useMemo(() => sortProjects(projects, selectedSort), [projects, selectedSort]);

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
      <header className="bg-surface-gray-subtler border-border-gray flex items-center justify-end border-b px-6 py-5">
        <div role="group" aria-label="프로젝트 정렬" className="text-detail-xs flex items-center gap-2 font-medium">
          {sortOptions.map((option, index) => (
            <Fragment key={option.value}>
              {index > 0 ? (
                <span aria-hidden className="text-text-disabled">
                  ·
                </span>
              ) : null}
              <button
                type="button"
                aria-pressed={selectedSort === option.value}
                onClick={() => setSelectedSort(option.value)}
                className={cn(
                  'focus-visible:ring-border-primary cursor-pointer rounded-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  selectedSort === option.value ? 'text-text-subtler' : 'text-text-disabled',
                )}
              >
                {option.label}
              </button>
            </Fragment>
          ))}
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4 lg:gap-[30px] lg:p-6">
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {visibleProjects.map((project) => (
            <li key={project.projectId}>
              <ProjectItem userLink={userLink} project={project} />
            </li>
          ))}
        </ul>

        {hasMore ? (
          <Button
            variant="tertiary"
            rightIcon={<DownIcon className="size-4 shrink-0" aria-hidden />}
            className="border-border-gray text-body-sm lg:text-body-xl h-[52px] w-full justify-center rounded-lg border lg:h-[58px] lg:px-7"
            onClick={() => setShowAll(true)}
          >
            프로젝트 더보기
          </Button>
        ) : null}
      </div>
    </section>
  );
};
