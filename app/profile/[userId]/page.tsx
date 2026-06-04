import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ProfileSectionStream } from '@/features/profile';
import { ProfileSectionSkeleton } from '@/features/profile/components/profile-section-skeleton';
import { buildProfileShareMetadata } from '@/features/profile/lib/build-profile-share-metadata';
import { ProjectSectionStream } from '@/features/project/components/project-section-stream';
import { ProjectSectionSkeleton } from '@/features/project/components/project-section.skeleton';
import { UserReviewStream } from '@/features/review';
import { UserReviewContainerSkeleton } from '@/features/review/components/user-review-container.skeleton';
import { SoftSkillsCardSkeleton, SoftSkillsCardStream } from '@/features/soft-skills';
import { TagCardSkeleton, TagCardStream } from '@/features/tag';
import { PageContainer } from '@/shared/components/page-container';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';

import type { Metadata } from 'next';

import { ProfileDetailView } from './_components/profile-detail-view';

type ProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export const generateMetadata = async ({ params }: ProfilePageProps): Promise<Metadata> => {
  const { userId } = await params;
  const profileUserId = parsePositiveInt(userId);

  if (profileUserId === null) {
    return { title: '프로필' };
  }

  return buildProfileShareMetadata(profileUserId);
};

const Page = async ({ params }: ProfilePageProps) => {
  const { userId } = await params;
  const profileUserId = parsePositiveInt(userId);

  if (profileUserId === null) {
    return notFound();
  }

  return (
    <PageContainer className="mb-20">
      <Suspense fallback={<ProfileSectionSkeleton />}>
        <ProfileSectionStream userId={profileUserId} />
      </Suspense>

      <ProfileDetailView
        userId={profileUserId}
        allTabContent={
          <>
            <div className="flex gap-6">
              <Suspense fallback={<TagCardSkeleton />}>
                <TagCardStream userId={profileUserId} />
              </Suspense>
              <Suspense fallback={<SoftSkillsCardSkeleton />}>
                <SoftSkillsCardStream userId={profileUserId} showDistribution />
              </Suspense>
            </div>
            <Suspense fallback={<UserReviewContainerSkeleton />}>
              <UserReviewStream userId={profileUserId} />
            </Suspense>
          </>
        }
        projectsTabContent={
          <Suspense fallback={<ProjectSectionSkeleton />}>
            <ProjectSectionStream userId={profileUserId} />
          </Suspense>
        }
      />
    </PageContainer>
  );
};

export default Page;
