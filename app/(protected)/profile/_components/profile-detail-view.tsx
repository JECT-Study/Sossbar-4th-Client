'use client';

import type { ReactNode } from 'react';

import { ProjectSection } from '@/features/project';
import { UserReviewContainerBoundary } from '@/features/review';
import { SoftSkillsCardBoundary } from '@/features/soft-skills';
import { TagCardBoundary } from '@/features/tag';
import { Tab } from '@/shared/components/tab';

interface Props {
  userId: number;
  allTabContent?: ReactNode;
  projectsTabContent?: ReactNode;
}

const DefaultAllTabContent = ({ userId }: { userId: number }) => (
  <>
    <div className="flex gap-6">
      <TagCardBoundary userId={userId} />
      <SoftSkillsCardBoundary userId={userId} showDistribution />
    </div>
    <UserReviewContainerBoundary userId={userId} />
  </>
);

export const ProfileDetailView = ({ userId, allTabContent, projectsTabContent }: Props) => (
  <Tab.Root key={userId} defaultValue="all">
    <Tab.List aria-label="프로필 정보 탭" className="w-full">
      <Tab.Trigger value="all">전체</Tab.Trigger>
      <Tab.Trigger value="projects">프로젝트별</Tab.Trigger>
    </Tab.List>
    <Tab.Content value="all" className="mt-6 flex flex-col gap-6">
      {allTabContent ?? <DefaultAllTabContent userId={userId} />}
    </Tab.Content>
    <Tab.Content value="projects" className="mt-10">
      {projectsTabContent ?? <ProjectSection userId={userId} />}
    </Tab.Content>
  </Tab.Root>
);
