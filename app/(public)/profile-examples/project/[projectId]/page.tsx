import { notFound } from 'next/navigation';

import { ProjectHeroSection } from '@/features/project/components/project-hero-section';
import { ReviewListCard } from '@/features/review/components/review-list/review-list-card';
import { SpectrumAverageSection } from '@/features/spectrum/components/spectrum-average-section';
import { TagAllSection } from '@/features/tag/components/tag-all-section';
import { TagTop3Section } from '@/features/tag/components/tag-top3-section';
import { PageContainer } from '@/shared/components/page-container';
import { ProfileStatCard } from '@/shared/components/profile-stat-card';
import { ROUTES } from '@/shared/constants/routes';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';

import { dummyReceivedTags, dummyReviews, dummyProjects, dummySpectrumInfo } from '../../dummy-data';

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const ProfileExampleProjectPage = async ({ params }: Props) => {
  const { projectId: rawProjectId } = await params;
  const projectId = parsePositiveInt(rawProjectId);

  if (projectId === null) {
    notFound();
  }

  const project = dummyProjects.find((item) => item.projectId === projectId);

  if (!project) {
    notFound();
  }

  return (
    <PageContainer className="mb-20 flex flex-col gap-6 pt-0 lg:gap-[30px] lg:pt-8">
      <ProjectHeroSection
        projectName={project.projectName}
        projectImage={project.projectImage}
        host={project.host}
        startDate={project.startDate}
        projectPositions={project.projectPositions}
        projectUrl={project.projectUrl}
        backHref={`${ROUTES.PROFILE_EXAMPLES}?tab=projects`}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-[30px] max-xl:[&>*]:h-auto! max-xl:[&>*]:w-full!">
        <ProfileStatCard
          title="받은 태그"
          info
          infoLabel="동료들이 남긴 후기에서 많이 선택된 태그예요"
          className="h-auto w-full lg:h-[652px] lg:w-[585px]"
          bodyClassName="gap-8"
        >
          <TagTop3Section tags={dummyReceivedTags.top3Tags} />
          <TagAllSection tags={dummyReceivedTags.allTags} />
        </ProfileStatCard>
        <ProfileStatCard
          title="소프트 스킬 스펙트럼"
          info
          infoLabel="동료들의 평가를 기반으로 자동 산출된 협업 성향이에요"
          className="h-auto w-full lg:w-[585px]"
        >
          <SpectrumAverageSection spectrumInfo={dummySpectrumInfo} />
          <div className="bg-surface-gray-subtler mt-auto rounded-lg px-4 py-3">
            <p className="text-detail-sm text-text-subtle font-normal">
              * 지표는 동료들의 평가를 기반으로 자동 산출됩니다.
            </p>
          </div>
        </ProfileStatCard>
      </div>

      <ReviewListCard reviews={dummyReviews} showProjectName={false} showSort showReportMenu />
    </PageContainer>
  );
};

export default ProfileExampleProjectPage;
