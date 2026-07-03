import { ProfileDetailView } from '@/features/profile';
import { ProfileSummary } from '@/features/profile/components/profile-summary';
import { ReviewListCard } from '@/features/review/components/review-list/review-list-card';
import { SpectrumAverageSection } from '@/features/spectrum/components/spectrum-average-section';
import { SpectrumDistributionSection } from '@/features/spectrum/components/spectrum-distribution-section';
import { TagAllSection } from '@/features/tag/components/tag-all-section';
import { TagTop3Section } from '@/features/tag/components/tag-top3-section';
import { PageContainer } from '@/shared/components/page-container';
import { ProfileStatCard } from '@/shared/components/profile-stat-card';

import { dummyProfile, dummyProjects, dummyReceivedTags, dummyReviews, dummySpectrumInfo } from './dummy-data';
import { ProjectSectionView } from './project-section-view';

const ProfileExamplesPage = () => (
  <PageContainer className="mb-20">
    <ProfileSummary profile={dummyProfile} />
    <ProfileDetailView
      userId={dummyProfile.userId}
      allTabContent={
        <>
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
              className="h-[652px] w-[585px]"
            >
              <SpectrumAverageSection spectrumInfo={dummySpectrumInfo} />
              <SpectrumDistributionSection spectrumInfo={dummySpectrumInfo} />
              <div className="bg-surface-gray-subtler mt-auto rounded-lg px-4 py-3">
                <p className="text-detail-sm text-text-subtle font-normal">
                  * 지표는 동료들의 평가를 기반으로 자동 산출됩니다.
                </p>
              </div>
            </ProfileStatCard>
          </div>
          <ReviewListCard reviews={dummyReviews} showProjectName showSort />
        </>
      }
      projectsTabContent={<ProjectSectionView projects={dummyProjects} />}
    />
  </PageContainer>
);

export default ProfileExamplesPage;
