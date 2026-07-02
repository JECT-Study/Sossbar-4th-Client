'use client';

import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { Tab } from '@/shared/components/tab';

import { useProfileDetailTab } from '../profile.hooks';

interface Props {
  userId: number;
  allTabContent: ReactNode;
  projectsTabContent: ReactNode;
}

// useSearchParams를 쓰는 useProfileDetailTab을 Suspense로 감싸지 않으면
// 정적 분석 시 서버가 빈 검색 파라미터로 렌더링해 하이드레이션이 어긋난다.
export const ProfileDetailView = (props: Props) => (
  <Suspense fallback={<ProfileDetailTabs {...props} value="all" onValueChange={() => {}} />}>
    <ProfileDetailTabsWithUrlSync {...props} />
  </Suspense>
);

const ProfileDetailTabsWithUrlSync = (props: Props) => {
  const { value, onValueChange } = useProfileDetailTab();

  return <ProfileDetailTabs {...props} value={value} onValueChange={onValueChange} />;
};

interface ProfileDetailTabsProps extends Props {
  value: string;
  onValueChange: (value: string) => void;
}

const ProfileDetailTabs = ({
  userId,
  allTabContent,
  projectsTabContent,
  value,
  onValueChange,
}: ProfileDetailTabsProps) => (
  <Tab.Root key={userId} value={value} onValueChange={onValueChange}>
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
