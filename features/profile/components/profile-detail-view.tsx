'use client';

import type { ReactNode } from 'react';

import { Tab } from '@/shared/components/tab';

interface Props {
  userId: number;
  allTabContent: ReactNode;
  projectsTabContent: ReactNode;
}

export const ProfileDetailView = ({ userId, allTabContent, projectsTabContent }: Props) => (
  <Tab.Root key={userId} defaultValue="all">
    <Tab.List aria-label="프로필 정보 탭" className="w-full gap-0">
      <Tab.Trigger value="all" className="flex-1">
        전체
      </Tab.Trigger>
      <Tab.Trigger value="projects" className="flex-1">
        프로젝트별
      </Tab.Trigger>
    </Tab.List>
    <Tab.Content value="all" className="mt-[30px] flex flex-col gap-[30px]">
      {allTabContent}
    </Tab.Content>
    <Tab.Content value="projects" className="mt-[30px]">
      {projectsTabContent}
    </Tab.Content>
  </Tab.Root>
);
