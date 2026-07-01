import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import {
  buildProfileShareMetadata,
  fetchMyProfile,
  fetchProfileById,
  ProfileByIdSectionEntry,
  ProfileDetailView,
  ProfileSectionLoading,
} from '@/features/profile';
import { ProjectSectionStream } from '@/features/project/components/project-section-stream';
import { ProjectSectionSkeleton } from '@/features/project/components/project-section.skeleton';
import { UserReviewStream } from '@/features/review';
import { UserReviewContainerSkeleton } from '@/features/review/components/user-review-container.skeleton';
import { SoftSkillsCardSkeleton, SoftSkillsCardStream } from '@/features/soft-skills';
import { TagCardEntry, TagCardLoading } from '@/features/tag';
import { PageContainer } from '@/shared/components/page-container';
import { SHARE_USER_NAME_PARAM } from '@/shared/constants/share-query';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';
import { parseShareDisplayName } from '@/shared/lib/parse-share-display-name';

import type { Metadata } from 'next';

type ProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
  searchParams: Promise<{
    [SHARE_USER_NAME_PARAM]?: string;
  }>;
};

const resolveProfileShareUserName = async (
  profileUserId: number,
  queryUserName?: string,
): Promise<string | undefined> => {
  const fromQuery = parseShareDisplayName(queryUserName);
  if (fromQuery) {
    return fromQuery;
  }

  try {
    const profile = await fetchProfileById(profileUserId);
    return profile.username;
  } catch {
    return undefined;
  }
};

export const generateMetadata = async ({ params, searchParams }: ProfilePageProps): Promise<Metadata> => {
  const { userId } = await params;
  const { [SHARE_USER_NAME_PARAM]: rawUserName } = await searchParams;
  const profileUserId = parsePositiveInt(userId);

  if (profileUserId === null) {
    return { title: '프로필' };
  }

  const userName = await resolveProfileShareUserName(profileUserId, rawUserName);
  const queryUserName = parseShareDisplayName(rawUserName);
  const pathSearchParams = new URLSearchParams();

  if (queryUserName) {
    pathSearchParams.set(SHARE_USER_NAME_PARAM, queryUserName);
  }

  const profilePath =
    pathSearchParams.size > 0
      ? `/profile/${profileUserId}?${pathSearchParams.toString()}`
      : `/profile/${profileUserId}`;

  return buildProfileShareMetadata(profileUserId, userName, profilePath);
};

const Page = async ({ params }: ProfilePageProps) => {
  const { userId } = await params;
  const profileUserId = parsePositiveInt(userId);

  if (profileUserId === null) {
    return notFound();
  }

  const cookieStore = await cookies();
  const [profile, myProfile] = await Promise.all([
    fetchProfileById(profileUserId),
    fetchMyProfile({ headers: { Cookie: cookieStore.toString() } }).catch(() => null),
  ]);
  const isMyProfile = myProfile?.userId === profileUserId;

  return (
    <PageContainer className="mb-20">
      <Suspense fallback={<ProfileSectionLoading />}>
        <ProfileByIdSectionEntry userId={profileUserId} isMyProfile={isMyProfile} />
      </Suspense>
      <ProfileDetailView
        userId={profileUserId}
        allTabContent={
          <>
            <div className="flex gap-[30px]">
              <Suspense fallback={<TagCardLoading />}>
                <TagCardEntry userLink={profile.userLink} />
              </Suspense>
              <Suspense fallback={<SoftSkillsCardSkeleton />}>
                <SoftSkillsCardStream userLink={profile.userLink} showDistribution />
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
