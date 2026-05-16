'use client';

import { ProfileSection } from '@/app/myprofile/profile-section';
import { ReviewListCard, SoftSkillsCard, TagCard } from '@/features/review';
import { PageContainer } from '@/shared/components/page-container';
import { Tab } from '@/shared/components/tab';

const MyProfilePage = () => {
  return (
    <PageContainer className="mb-20">
      <ProfileSection />
      <Tab.Root defaultValue="all">
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
        <Tab.Content value="projects" className="mt-6"></Tab.Content>
      </Tab.Root>
    </PageContainer>
  );
};

export default MyProfilePage;
