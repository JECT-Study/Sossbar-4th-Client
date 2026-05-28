import { Suspense } from 'react';

import { ProjectInvitePageContent } from '@/features/project/components/project-invite-page-content';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sossbar - 프로젝트 초대',
  description: '프로젝트 팀에 참여하고 동료와 후기를 나눠 보세요',
};

const ProjectInviteFallback = () => (
  <div className="flex min-h-[240px] items-center justify-center">
    <p className="text-body-base text-text-subtle">화면을 불러오는 중…</p>
  </div>
);

const ProjectInvitePage = () => (
  <Suspense fallback={<ProjectInviteFallback />}>
    <ProjectInvitePageContent />
  </Suspense>
);

export default ProjectInvitePage;
