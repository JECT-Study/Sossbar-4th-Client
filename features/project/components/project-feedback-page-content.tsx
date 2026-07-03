'use client';

import { ProjectReviewCard } from '@/features/review';
import { SpectrumCardGate } from '@/features/spectrum';
import { TagCardGate } from '@/features/tag';
import { PageContainer } from '@/shared/components/page-container';

import { useUserProject } from '../project.hooks';
import { ProjectHeroSection } from './project-hero-section';

type ProjectFeedbackPageContentProps = {
  userLink: string;
  projectId: number;
};

export const ProjectFeedbackPageContent = ({ userLink, projectId }: ProjectFeedbackPageContentProps) => {
  const { data: project, isPending, isError } = useUserProject(userLink, projectId);

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

  return (
    <PageContainer className="mb-20 flex flex-col gap-[30px] pt-8">
      <ProjectHeroSection
        projectName={project.projectName}
        projectImage={project.projectImage}
        host={project.host}
        startDate={project.startDate}
        projectPositions={project.projectPositions}
        projectUrl={project.projectUrl}
      />

      <div className="flex gap-[30px]">
        <TagCardGate userLink={userLink} projectId={projectId} />
        <SpectrumCardGate userLink={userLink} projectId={projectId} showDistribution={false} />
      </div>

      <ProjectReviewCard userLink={userLink} projectId={projectId} />
    </PageContainer>
  );
};
