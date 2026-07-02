'use client';

import { useMyProfile } from '@/features/profile';
import { PageContainer } from '@/shared/components/page-container';

import { ProjectDetailHeading } from './project-detail-heading';
import { ProjectInfoCard } from './project-info-card';
import { ProjectMembersCard } from './project-members-card';
import { useProject } from '../../project.hooks';

interface Props {
  projectId: number;
}

export const ProjectDetailPageContent = ({ projectId }: Props) => {
  const { data: project, isPending, isError } = useProject(projectId);
  const { data: myProfile } = useMyProfile();

  if (isPending) {
    return (
      <PageContainer className="mt-15.5">
        <p className="text-body-base text-text-subtle">프로젝트를 불러오는 중…</p>
      </PageContainer>
    );
  }

  if (isError || !project) {
    return (
      <PageContainer className="mt-15.5">
        <p className="text-body-base text-text-basic">프로젝트 정보를 불러오지 못했습니다.</p>
      </PageContainer>
    );
  }

  if (!myProfile) {
    return (
      <PageContainer className="mt-15.5">
        <p className="text-body-base text-text-basic">로그인이 필요합니다.</p>
      </PageContainer>
    );
  }

  const isLeader = project.members.some(
    (member) => member.userId === myProfile.userId && member.memberStatus === 'LEADER',
  );

  return (
    <PageContainer className="mb-20 flex flex-col gap-8">
      <ProjectDetailHeading
        projectStatus={project.projectStatus}
        isLeader={isLeader}
        projectLink={project.projectLink}
        inviterName={myProfile.username}
      />
      <ProjectInfoCard project={project} isLeader={isLeader} />
      <ProjectMembersCard
        members={project.members}
        projectStatus={project.projectStatus}
        isLeader={isLeader}
        myUserId={myProfile.userId}
      />
    </PageContainer>
  );
};
