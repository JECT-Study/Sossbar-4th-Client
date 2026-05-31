'use client';

import { ProfileSectionBoundary, ProjectSection } from '@/features/profile';
import { SoftSkillsCard, TagCard, UserReviewContainer } from '@/features/review';
import { Tab } from '@/shared/components/tab';
interface Props {
  userId: number;
}

export const ProfileDetailView = ({ userId }: Props) => (
  <>
    <ProfileSectionBoundary userId={userId} />
    <Tab.Root key={userId} defaultValue="all">
      <Tab.List aria-label="프로필 정보 탭" className="w-full">
        <Tab.Trigger value="all">전체</Tab.Trigger>
        <Tab.Trigger value="projects">프로젝트별</Tab.Trigger>
      </Tab.List>
      <Tab.Content value="all" className="mt-6 flex flex-col gap-6">
        <div className="flex gap-6">
          <TagCard userId={userId} />
          <SoftSkillsCard userId={userId} showDistribution />
        </div>
        <UserReviewContainer userId={userId} />
      </Tab.Content>
      <Tab.Content value="projects" className="mt-10">
        <ProjectSection userId={userId} />
      </Tab.Content>
    </Tab.Root>
  </>
);
