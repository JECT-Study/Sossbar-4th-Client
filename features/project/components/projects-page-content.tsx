'use client';

import { useState } from 'react';

import { CreateProjectModal } from '@/features/project/components/create-project-modal';
import { ProjectInviteHandler } from '@/features/project/components/project-invite-handler';
import { ProjectListGate } from '@/features/project/components/project-list-gate';
import { ProjectListSection } from '@/features/project/components/project-list-section';
import { SettingIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { PageContainer } from '@/shared/components/page-container';

import type { ProjectListFilterStatus, ProjectSort } from '../project.types';

import { DEFAULT_PROJECT_LIST_PARAMS } from '../project.constants';

export const ProjectsPageContent = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sort, setSort] = useState<ProjectSort>(DEFAULT_PROJECT_LIST_PARAMS.sort);
  const [status, setStatus] = useState<ProjectListFilterStatus>(DEFAULT_PROJECT_LIST_PARAMS.status);

  return (
    <PageContainer>
      <div className="border-border-gray-light mt-8 flex flex-col gap-4 border-b-[3px] pb-8 lg:mt-15.5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-heading-lg text-text-basic font-bold">프로젝트 관리</h1>
          <p className="text-body-sm text-text-subtle lg:text-heading-xs mt-2 font-normal">
            프로젝트를 생성하고 팀원들과 후기를 주고받으세요.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="medium"
          leftIcon={<SettingIcon aria-hidden className="size-4 lg:size-6" />}
          className="h-11 w-full justify-center lg:h-auto lg:w-auto"
          onClick={() => setIsCreateModalOpen(true)}
        >
          새 프로젝트 생성
        </Button>
      </div>

      <ProjectListSection status={status} sort={sort} onStatusChange={setStatus} onSortChange={setSort}>
        <ProjectListGate params={{ sort, status }} />
      </ProjectListSection>

      <CreateProjectModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
      <ProjectInviteHandler />
    </PageContainer>
  );
};
