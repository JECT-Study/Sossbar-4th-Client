'use client';

import { ReviewListCard, SoftSkillsCard, TagCard } from '@/features/review';
import { PageContainer } from '@/shared/components/page-container';
import { Tab } from '@/shared/components/tab';

import { ProfileSection } from './profile-section';
import { ProjectSection } from './project-section';

type ProfilePageContentProps = {
  userId: number;
  isMyProfile: boolean;
};

export const ProfilePageContent = ({ userId, isMyProfile }: ProfilePageContentProps) => {
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
          <ReviewListCard variant="all" isMyProfile={isMyProfile} />
        </Tab.Content>
        <Tab.Content value="projects" className="mt-10">
          <ProjectSection />
        </Tab.Content>
      </Tab.Root>
    </PageContainer>
  );
};
