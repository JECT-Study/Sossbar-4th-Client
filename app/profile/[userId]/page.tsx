'use client';

import { use } from 'react';

import { ProfileSection, ProjectSection } from '@/features/profile';
import { ReviewListCard, SoftSkillsCard, TagCard } from '@/features/review';
import { PageContainer } from '@/shared/components/page-container';
import { Tab } from '@/shared/components/tab';
import { useSessionUser } from '@/shared/lib/session-user';

type ProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

const ProfilePage = ({ params }: ProfilePageProps) => {
  const { userId } = use(params);
  const profileUserId = Number(userId);
  const sessionUser = useSessionUser();
  const isMyProfile = profileUserId === sessionUser?.userId;

  return (
    <PageContainer className="mb-20">
      <ProfileSection isMyProfile={isMyProfile} />
      <Tab.Root key={userId} defaultValue="all">
        <Tab.List aria-label="프로필 정보 탭" className="w-full">
          <Tab.Trigger value="all">전체</Tab.Trigger>
          <Tab.Trigger value="projects">프로젝트별</Tab.Trigger>
        </Tab.List>
        <Tab.Content value="all" className="mt-6 flex flex-col gap-6">
          <div className="flex gap-6">
            <TagCard />
            <SoftSkillsCard />
          </div>
          <ReviewListCard />
        </Tab.Content>
        <Tab.Content value="projects" className="mt-10">
          <ProjectSection />
        </Tab.Content>
      </Tab.Root>
    </PageContainer>
  );
};

export default ProfilePage;
