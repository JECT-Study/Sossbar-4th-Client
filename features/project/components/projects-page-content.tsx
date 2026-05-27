'use client';

import { useMemo, useState } from 'react';

import { useProjects } from '@/features/project/api/queries';
import { CreateProjectModal } from '@/features/project/components/create-project-modal';
import { ProjectCard } from '@/features/project/components/project-card';
import type { ProjectMemberResponse, ProjectResponse } from '@/features/project/types';
import { SettingIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { PageContainer } from '@/shared/components/page-container';
import { useSessionUser } from '@/shared/lib/session-user';

type ReviewStatus = 'writable' | 'completed' | 'self';

type ProjectMember = {
  memberId: number;
  name: string;
  reviewStatus: ReviewStatus;
};

type ProjectListItem = {
  projectId: number;
  projectName: string;
  host: string;
  startDate: string;
  endDate: string;
  projectLink: string;
  projectImage: string | null;
  projectStatus: 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  myMemberStatus: 'LEADER' | 'MEMBER';
  members: ProjectMember[];
};

const toProjectCardMember = ({
  member,
  sessionUserId,
}: {
  member: ProjectMemberResponse;
  sessionUserId: number;
}): ProjectMember => {
  const isSelf = member.userId === sessionUserId;

  return {
    memberId: member.userId,
    name: member.username,
    reviewStatus: isSelf ? 'self' : member.reviewWritten ? 'completed' : 'writable',
  };
};

const toProjectListItem = ({
  project,
  sessionUserId,
}: {
  project: ProjectResponse;
  sessionUserId: number;
}): ProjectListItem => {
  const myMember = project.members.find((m) => m.userId === sessionUserId);
  const myMemberStatus: ProjectListItem['myMemberStatus'] = myMember?.memberStatus ?? 'MEMBER';

  return {
    projectId: project.projectId,
    projectName: project.projectName,
    host: project.host,
    startDate: project.startDate ?? '',
    endDate: project.endDate ?? '',
    projectLink: project.projectLink,
    projectImage: project.projectImage,
    projectStatus: project.projectStatus,
    myMemberStatus,
    members: project.members.map((member) => toProjectCardMember({ member, sessionUserId })),
  };
};

export const ProjectsPageContent = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const sessionUser = useSessionUser();
  const sessionUserId = sessionUser?.userId ?? 0;
  const hasSession = sessionUserId > 0;

  const { data, isPending, isError, refetch } = useProjects(hasSession);

  const projects = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map((project) => toProjectListItem({ project, sessionUserId }));
  }, [data, sessionUserId]);

  return (
    <PageContainer>
      <div className="border-border-gray-light mt-15.5 flex flex-row items-start justify-between border-b-[3px] pb-8">
        <div>
          <h1 className="text-heading-lg text-text-basic font-bold">프로젝트 관리</h1>
          <p className="text-heading-xs text-text-subtle mt-2 font-normal">
            프로젝트를 생성하고 팀원들과 후기를 주고받으세요.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="large"
          leftIcon={<SettingIcon aria-hidden className="size-6" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          새 프로젝트 생성
        </Button>
      </div>

      <div className="my-10.5">
        {!hasSession ? (
          <div className="border-divider-gray-light flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-12 text-center">
            <p className="text-body-base text-text-basic">로그인 후 프로젝트 목록을 불러올 수 있습니다.</p>
          </div>
        ) : isPending ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <p className="text-body-base text-text-subtle">프로젝트 목록을 불러오는 중…</p>
          </div>
        ) : isError ? (
          <div className="border-divider-gray-light flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border px-6 py-12 text-center">
            <p className="text-body-base text-text-basic">프로젝트 목록을 불러오지 못했습니다.</p>
            <Button type="button" variant="secondary" size="medium" onClick={() => void refetch()}>
              다시 시도
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <p className="text-body-base text-text-subtle">참여 중인 프로젝트가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </PageContainer>
  );
};
