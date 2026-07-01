import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { fetchMyProfile, ProfileDetailView, ProfileSectionSkeleton, ProfileSectionStream } from '@/features/profile';
import { ProjectSectionStream } from '@/features/project/components/project-section-stream';
import { ProjectSectionSkeleton } from '@/features/project/components/project-section.skeleton';
import { UserReviewStream } from '@/features/review';
import { UserReviewContainerSkeleton } from '@/features/review/components/user-review-container.skeleton';
import { SoftSkillsCardSkeleton, SoftSkillsCardStream } from '@/features/soft-skills';
import { TagCardSkeleton, TagCardStream } from '@/features/tag';
import { PageContainer } from '@/shared/components/page-container';

import type { Metadata } from 'next';

export const metadata: Metadata = { title: '내 소스' };

const Page = async () => {
  const cookieStore = await cookies();
  const myProfile = await fetchMyProfile({ headers: { Cookie: cookieStore.toString() } });

  return (
    <PageContainer className="mb-20">
      <Suspense fallback={<ProfileSectionSkeleton />}>
        <ProfileSectionStream userId={myProfile.userId} isMyProfile />
      </Suspense>
      <ProfileDetailView
        userId={myProfile.userId}
        allTabContent={
          <>
            <div className="flex gap-[30px]">
              <Suspense fallback={<TagCardSkeleton />}>
                <TagCardStream userId={myProfile.userId} />
              </Suspense>
              <Suspense fallback={<SoftSkillsCardSkeleton />}>
                <SoftSkillsCardStream userId={myProfile.userId} showDistribution />
              </Suspense>
            </div>
            <Suspense fallback={<UserReviewContainerSkeleton />}>
              <UserReviewStream userId={myProfile.userId} />
            </Suspense>
          </>
        }
        projectsTabContent={
          <Suspense fallback={<ProjectSectionSkeleton />}>
            <ProjectSectionStream userId={myProfile.userId} />
          </Suspense>
        }
      />
    </PageContainer>
  );
};

export default Page;
