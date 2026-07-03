import Image from 'next/image';
import { notFound } from 'next/navigation';

import { ReviewListCard } from '@/features/review/components/review-list/review-list-card';
import { SpectrumAverageSection } from '@/features/spectrum/components/spectrum-average-section';
import { TagAllSection } from '@/features/tag/components/tag-all-section';
import { TagTop3Section } from '@/features/tag/components/tag-top3-section';
import { PageContainer } from '@/shared/components/page-container';
import { ProfileStatCard } from '@/shared/components/profile-stat-card';
import { formatIsoDateToDots } from '@/shared/lib/format-date';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';

import { dummyReceivedTags, dummyReviews, dummyProjects, dummySpectrumInfo } from '../../dummy-data';

const DEFAULT_PROJECT_IMAGE = '/default.png';

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

  const subtitle = [project.host, project.startDate ? formatIsoDateToDots(project.startDate) : null]
    .filter(Boolean)
    .join(' · ');

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
        <ProfileStatCard
          title="받은 태그"
          info
          infoLabel="동료들이 남긴 후기에서 많이 선택된 태그예요"
          className="h-[652px] w-[585px]"
          bodyClassName="gap-8"
        >
          <TagTop3Section tags={dummyReceivedTags.top3Tags} />
          <TagAllSection tags={dummyReceivedTags.allTags} />
        </ProfileStatCard>
        <ProfileStatCard
          title="소프트 스킬 스펙트럼"
          info
          infoLabel="동료들의 평가를 기반으로 자동 산출된 협업 성향이에요"
          className="h-auto w-[585px]"
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
