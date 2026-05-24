'use client';

import { useMemo, useState } from 'react';

import { CreateProjectModal } from '@/features/project/components/create-project-modal';
import { ProjectCard } from '@/features/project/components/project-card';
import { getCompletedReviews } from '@/features/project/lib/completed-review-storage';
import { SettingIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { PageContainer } from '@/shared/components/page-container';

type ProjectMember = {
  memberId: number;
  name: string;
  reviewStatus: 'writable' | 'completed' | 'self';
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

const applyCompletedReviews = (projects: ProjectListItem[]): ProjectListItem[] => {
  const completed = getCompletedReviews();

  return projects.map((project) => ({
    ...project,
    members: project.members.map((member) => {
      if (member.reviewStatus !== 'writable') {
        return member;
      }

      return completed[`${project.projectId}-${member.memberId}`]
        ? { ...member, reviewStatus: 'completed' as const }
        : member;
    }),
  }));
};

const mockProjects: ProjectListItem[] = [
  {
    projectId: 1,
    projectName: '소스바 프로젝트',
    host: 'JECT',
    startDate: '2025-03-01T00:00:00',
    endDate: '2025-06-30T00:00:00',
    projectLink: '30b2e693-ca41-4e26-96dc-da7e3a6a0de1',
    projectImage: null,
    projectStatus: 'IN_PROGRESS',
    myMemberStatus: 'LEADER',
    members: [
      { memberId: 1, name: '김재희', reviewStatus: 'self' },
      { memberId: 2, name: '유하영', reviewStatus: 'completed' },
      { memberId: 3, name: '한예진', reviewStatus: 'writable' },
      { memberId: 4, name: '양현준', reviewStatus: 'completed' },
    ],
  },
  {
    projectId: 2,
    projectName: '소스바 프로젝트',
    host: 'JECT',
    startDate: '2025-03-01T00:00:00',
    endDate: '2025-06-30T00:00:00',
    projectLink: '30b2e693-ca41-4e26-96dc-da7e3a6a0de1',
    projectImage: null,
    projectStatus: 'COMPLETED',
    myMemberStatus: 'MEMBER',
    members: [
      { memberId: 5, name: '박민서', reviewStatus: 'writable' },
      { memberId: 6, name: '이도윤', reviewStatus: 'self' },
      { memberId: 7, name: '정서연', reviewStatus: 'completed' },
      { memberId: 8, name: '최준호', reviewStatus: 'writable' },
    ],
  },
];

export const ProjectsPageContent = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const projects = useMemo(() => applyCompletedReviews(mockProjects), []);

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

      <div className="my-10.5 space-y-6">
        {projects.map((project) => (
          <ProjectCard key={project.projectId} project={project} />
        ))}
      </div>

      <CreateProjectModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </PageContainer>
  );
};
