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
import { UserReviewCardEntry, UserReviewCardLoading } from '@/features/review';
import { SpectrumCardEntry, SpectrumCardLoading } from '@/features/spectrum';
import { TagCardEntry, TagCardLoading } from '@/features/tag';
import { PageContainer } from '@/shared/components/page-container';
import { SHARE_USER_NAME_PARAM } from '@/shared/constants/share-query';
import { parseShareDisplayName } from '@/shared/lib/parse-share-display-name';

import type { Metadata } from 'next';

type ProfilePageProps = {
  params: Promise<{
    userLink: string;
  }>;
  searchParams: Promise<{
    [SHARE_USER_NAME_PARAM]?: string;
  }>;
};

const resolveProfileShareUserName = async (userLink: string, queryUserName?: string): Promise<string | undefined> => {
  const fromQuery = parseShareDisplayName(queryUserName);
  if (fromQuery) {
    return fromQuery;
  }

  try {
    const profile = await fetchProfileById(userLink);
    return profile.username;
  } catch {
    return undefined;
  }
};

export const generateMetadata = async ({ params, searchParams }: ProfilePageProps): Promise<Metadata> => {
  const { userLink } = await params;
  const { [SHARE_USER_NAME_PARAM]: rawUserName } = await searchParams;

  const userName = await resolveProfileShareUserName(userLink, rawUserName);
  const queryUserName = parseShareDisplayName(rawUserName);
  const pathSearchParams = new URLSearchParams();

  if (queryUserName) {
    pathSearchParams.set(SHARE_USER_NAME_PARAM, queryUserName);
  }

  const profilePath =
    pathSearchParams.size > 0 ? `/profile/${userLink}?${pathSearchParams.toString()}` : `/profile/${userLink}`;

  return buildProfileShareMetadata(userLink, userName, profilePath);
};

const Page = async ({ params }: ProfilePageProps) => {
  const { userLink } = await params;

  if (!userLink) {
    return notFound();
  }

  const cookieStore = await cookies();
  const [profile, myProfile] = await Promise.all([
    fetchProfileById(userLink),
    fetchMyProfile({ headers: { Cookie: cookieStore.toString() } }).catch(() => null),
  ]);
  const isMyProfile = myProfile?.userLink === userLink;

  return (
    <PageContainer className="mb-20">
      <Suspense fallback={<ProfileSectionLoading />}>
        <ProfileByIdSectionEntry userLink={userLink} isMyProfile={isMyProfile} />
      </Suspense>
      <ProfileDetailView
        userId={profile.userId}
        allTabContent={
          <>
            <div className="flex gap-[30px]">
              <Suspense fallback={<TagCardLoading />}>
                <TagCardEntry userLink={profile.userLink} />
              </Suspense>
              <Suspense fallback={<SpectrumCardLoading />}>
                <SpectrumCardEntry userLink={profile.userLink} showDistribution />
              </Suspense>
            </div>
            <Suspense fallback={<UserReviewCardLoading />}>
              <UserReviewCardEntry userId={profile.userId} />
            </Suspense>
          </>
        }
        projectsTabContent={
          <Suspense fallback={<ProjectSectionSkeleton />}>
            <ProjectSectionStream userId={profile.userId} userLink={profile.userLink} />
          </Suspense>
        }
      />
    </PageContainer>
  );
};

export default Page;
