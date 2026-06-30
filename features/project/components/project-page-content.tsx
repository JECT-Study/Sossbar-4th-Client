'use client';

import Image from 'next/image';

import { ProjectReviewContainer } from '@/features/review';
import { SoftSkillsCardBoundary } from '@/features/soft-skills';
import { TagCardBoundary } from '@/features/tag';
import { PageContainer } from '@/shared/components/page-container';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

import { useProject } from '../api/queries';

const DEFAULT_PROJECT_IMAGE = '/default.png';

type ProjectPageContentProps = {
  userId: number;
  projectId: number;
};

export const ProjectPageContent = ({ userId, projectId }: ProjectPageContentProps) => {
  const { data: project, isPending, isError } = useProject(projectId);

  if (isPending) {
    return (
      <PageContainer className="mt-15.5">
        <p className="text-body-base text-text-subtle">프로젝트를 불러오는 중…</p>
      </PageContainer>
    );
  }

  if (isError || !project) {
    return (
      <PageContainer className="mt-15.5">
        <p className="text-body-base text-text-basic">프로젝트 정보를 불러오지 못했습니다.</p>
      </PageContainer>
    );
  }

  const subtitleParts = [project.host, project.startDate ? formatIsoDateToDots(project.startDate) : null].filter(
    Boolean,
  );
  const subtitle = subtitleParts.join(' · ');

  return (
    <PageContainer className="mb-20 flex flex-col gap-[30px] pt-8">
      <section className="border-border-gray-light flex w-full gap-6 border-b-[3px] pb-8">
        <div className="border-border-gray-light relative h-[106px] w-[142px] shrink-0 overflow-hidden rounded-2xl border">
          <Image
            src={project.projectImage ?? DEFAULT_PROJECT_IMAGE}
            alt={`${project.projectName} 이미지`}
            fill
            sizes="142px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-lg text-text-basic font-bold">{project.projectName}</h1>
          {subtitle ? <p className="text-body-base text-text-subtle font-normal">{subtitle}</p> : null}
        </div>
      </section>

      <div className="flex gap-[30px]">
        <TagCardBoundary userId={userId} projectId={projectId} collapsible />
        <SoftSkillsCardBoundary userId={userId} projectId={projectId} showDistribution={false} />
      </div>

      <ProjectReviewContainer userId={userId} projectId={projectId} />
    </PageContainer>
  );
};
