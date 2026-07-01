'use client';

import { CopyIcon, RoundCheckIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';

import type { ProjectStatus } from '../../project.types';

interface Props {
  projectStatus: ProjectStatus;
  isLeader: boolean;
}

export const ProjectDetailHeading = ({ projectStatus, isLeader }: Props) => {
  const isInProgress = projectStatus === 'IN_PROGRESS';

  return (
    <header className="border-border-gray-light flex items-end justify-between border-b-[3px] pt-15.5 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-lg text-text-basic font-bold">프로젝트 상세</h1>
        <p className="text-body-base text-text-subtle">프로젝트 정보와 팀원을 확인하고, 필요하면 수정할 수 있어요.</p>
      </div>

      {isLeader && isInProgress ? (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="medium"
            leftIcon={<CopyIcon aria-hidden className="size-4" />}
          >
            초대 링크 복사
          </Button>
          <Button
            type="button"
            variant="primary"
            size="medium"
            leftIcon={<RoundCheckIcon aria-hidden className="size-4" />}
          >
            우리 팀 확정하기
          </Button>
        </div>
      ) : null}
    </header>
  );
};
