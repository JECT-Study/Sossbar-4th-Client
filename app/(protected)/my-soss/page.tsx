import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { fetchMyProfile, MyProfileSectionGate, ProfileDetailView } from '@/features/profile';
import { ProjectSectionStream } from '@/features/project/components/project-section-stream';
import { ProjectSectionSkeleton } from '@/features/project/components/project-section.skeleton';
import { UserReviewStream } from '@/features/review';
import { UserReviewContainerSkeleton } from '@/features/review/components/user-review-container.skeleton';
import { SpectrumCardEntry, SpectrumCardLoading } from '@/features/spectrum';
import { TagCardEntry, TagCardLoading } from '@/features/tag';
import { PageContainer } from '@/shared/components/page-container';

import type { Metadata } from 'next';

export const metadata: Metadata = { title: '내 소스' };

const Page = async () => {
  const cookieStore = await cookies();
  const myProfile = await fetchMyProfile({ headers: { Cookie: cookieStore.toString() } });

  return (
    <PageContainer className="mb-20">
      <MyProfileSectionGate />
      <ProfileDetailView
        userId={myProfile.userId}
        allTabContent={
          <>
            <div className="flex gap-[30px]">
              <Suspense fallback={<TagCardLoading />}>
                <TagCardEntry userLink={myProfile.userLink} />
              </Suspense>
              <Suspense fallback={<SpectrumCardLoading />}>
                <SpectrumCardEntry userLink={myProfile.userLink} showDistribution />
              </Suspense>
            </div>
            <Suspense fallback={<UserReviewContainerSkeleton />}>
              <UserReviewStream userId={myProfile.userId} />
            </Suspense>
          </>
        }
        projectsTabContent={
          <Suspense fallback={<ProjectSectionSkeleton />}>
            <ProjectSectionStream userId={myProfile.userId} userLink={myProfile.userLink} />
          </Suspense>
        }
      />
    </PageContainer>
  );
};

export default Page;
