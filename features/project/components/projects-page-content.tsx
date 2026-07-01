'use client';

import Link from 'next/link';
import { useState } from 'react';

import { CreateProjectModal } from '@/features/project/components/create-project-modal';
import { ProjectCard } from '@/features/project/components/project-card';
import { ProjectInviteHandler } from '@/features/project/components/project-invite-handler';
import { DownIcon, SettingIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { PageContainer } from '@/shared/components/page-container';

import { useProjectCards } from '../project.hooks';

export const ProjectsPageContent = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { projects, hasSession, isPending, isError, refetch } = useProjectCards();

  const renderProjectList = () => {
    if (!hasSession) {
      return (
        <div className="border-divider-gray-light flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-12 text-center">
          <p className="text-body-base text-text-basic">로그인 후 프로젝트 목록을 불러올 수 있습니다.</p>
          {process.env.NODE_ENV === 'development' ? (
            <Button type="button" variant="secondary" size="medium" asChild>
              <Link href="/login/test">테스트 계정으로 로그인</Link>
            </Button>
          ) : null}
        </div>
      );
    }

    if (isPending) {
      return (
        <div className="flex min-h-[240px] items-center justify-center">
          <p className="text-body-base text-text-subtle">프로젝트 목록을 불러오는 중…</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="border-divider-gray-light flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border px-6 py-12 text-center">
          <p className="text-body-base text-text-basic">프로젝트 목록을 불러오지 못했습니다.</p>
          <Button type="button" variant="secondary" size="medium" onClick={() => void refetch()}>
            다시 시도
          </Button>
        </div>
      );
    }

    if (projects.length === 0) {
      return (
        <div className="flex min-h-[240px] items-center justify-center">
          <p className="text-body-base text-text-subtle">참여 중인 프로젝트가 없습니다.</p>
        </div>
      );
    }

    return projects.map((project) => <ProjectCard key={project.projectId} project={project} />);
  };

  const listContent = renderProjectList();

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
          size="medium"
          leftIcon={<SettingIcon aria-hidden className="size-6" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          새 프로젝트 생성
        </Button>
      </div>

      <section className="border-border-gray mt-[30px] mb-20 overflow-hidden rounded-2xl border">
        <div className="bg-surface-gray-subtle border-border-gray flex h-16 items-center justify-end border-b px-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-body-base text-text-subtle inline-flex h-6 items-center gap-1 px-4 font-medium"
            >
              전체
              <DownIcon aria-hidden className="size-4" />
            </button>
            <button
              type="button"
              className="text-body-base text-text-subtle inline-flex h-6 items-center gap-1 px-4 font-medium"
            >
              최신순
              <DownIcon aria-hidden className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-6 p-8">{listContent}</div>
      </section>

      <CreateProjectModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
      <ProjectInviteHandler />
    </PageContainer>
  );
};
