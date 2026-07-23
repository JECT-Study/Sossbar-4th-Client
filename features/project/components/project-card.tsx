'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';

import { ProjectStateBadge } from '@/features/project/components/project-state-badge';
import { EllipsisVerticalIcon, TrashIcon } from '@/shared/assets/icons';
import { IconButton } from '@/shared/components/button';
import { ConfirmationDialog } from '@/shared/components/dialog/confirmation-dialog';
import { Dropdown } from '@/shared/components/dropdown';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

import type { ProjectCardItem, ProjectCardMember } from '../project.types';

import { useDeleteProject } from '../project.hooks';

const DEFAULT_PROJECT_IMAGE = '/default.png';

interface ProjectCardProps {
  project: ProjectCardItem;
}

interface ProjectCardImageProps {
  projectName: string;
  projectImage: string | null;
}

interface ProjectCardHeaderProps {
  isLeader: boolean;
  projectName: string;
  projectStatus: ProjectCardItem['projectStatus'];
  startDate: string;
  onDelete?: () => void;
}

interface ProjectCardTitleProps {
  host: string;
  projectName: string;
  startDate: string;
  endDate: string;
}

interface ProjectMemberListProps {
  members: readonly ProjectCardMember[];
  isLeader: boolean;
  projectStatus: ProjectCardItem['projectStatus'];
  reviewedCount: number;
  totalReviewTargetCount: number;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const isLeader = project.myMemberStatus === 'LEADER';
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [deleteProjectError, setDeleteProjectError] = useState<string | null>(null);
  const { mutateAsync: deleteProject, isPending: isDeletingProject } = useDeleteProject();

  const handleDeleteProject = useCallback(async () => {
    setDeleteProjectError(null);
    try {
      await deleteProject(project.projectId);
      setDeleteProjectOpen(false);
    } catch {
      setDeleteProjectError('프로젝트 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  }, [deleteProject, project.projectId]);

  return (
    <>
      <Link
        href={ROUTES.PROJECT_DETAIL(project.projectId)}
        className="focus-visible:ring-border-secondary block rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <article className="border-border-gray-light bg-surface-white grid grid-cols-[80px_1fr] gap-x-3 gap-y-4 rounded-2xl border p-4 shadow-[0px_4px_4px_rgba(96,96,96,0.15)] lg:grid-cols-[286px_1fr] lg:gap-6 lg:p-6 lg:shadow-none">
          <div className="col-span-2 lg:col-start-2 lg:row-start-1">
            <ProjectCardHeader
              isLeader={isLeader}
              projectName={project.projectName}
              projectStatus={project.projectStatus}
              startDate={project.startDate}
              onDelete={isLeader ? () => setDeleteProjectOpen(true) : undefined}
            />
          </div>

          <ProjectCardImage projectName={project.projectName} projectImage={project.projectImage} />

          <div className="flex min-w-0 flex-col gap-2 lg:col-start-2 lg:row-start-2 lg:gap-4">
            <ProjectCardTitle
              projectName={project.projectName}
              host={project.host}
              startDate={project.startDate}
              endDate={project.endDate}
            />
            <ProjectCardNotice projectStatus={project.projectStatus} />
            <ProjectMemberList
              members={project.members}
              isLeader={isLeader}
              projectStatus={project.projectStatus}
              reviewedCount={project.reviewedCount}
              totalReviewTargetCount={project.totalReviewTargetCount}
            />
          </div>
        </article>
      </Link>

      {isLeader ? (
        <ConfirmationDialog
          open={deleteProjectOpen}
          title="프로젝트를 삭제할까요?"
          description="삭제하면 복구할 수 없습니다. 팀원과의 후기 기록도 함께 삭제될 수 있습니다."
          confirmText="삭제하기"
          cancelText="취소"
          onOpenChange={(open) => {
            if (!open) {
              setDeleteProjectError(null);
            }
            setDeleteProjectOpen(open);
          }}
          onConfirm={handleDeleteProject}
          isConfirming={isDeletingProject}
          errorMessage={deleteProjectError ?? undefined}
        />
      ) : null}
    </>
  );
};

const ProjectCardImage = ({ projectName, projectImage }: ProjectCardImageProps) => {
  return (
    <div className="relative size-20 shrink-0 self-start overflow-hidden rounded-xl lg:row-span-3 lg:row-start-1 lg:h-[214px] lg:w-[286px] lg:rounded-2xl">
      <Image
        src={projectImage || DEFAULT_PROJECT_IMAGE}
        alt={`${projectName} 이미지`}
        fill
        sizes="(min-width: 1024px) 286px, 80px"
        className="object-cover"
      />
    </div>
  );
};

const ProjectCardHeader = ({ isLeader, projectName, projectStatus, startDate, onDelete }: ProjectCardHeaderProps) => {
  const isInProgress = projectStatus === 'IN_PROGRESS';

  return (
    <div className="flex h-8 flex-row items-start justify-between">
      <div className="flex flex-row items-center gap-2">
        <ProjectStateBadge variant={isInProgress ? 'waiting' : 'success'} />
        {isLeader ? <ProjectStateBadge variant="leader" /> : null}
      </div>
      <div className="flex items-center gap-1 lg:gap-4">
        <time className="text-detail-xs text-text-subtle lg:text-body-base font-normal" dateTime={startDate}>
          {formatIsoDateToDots(startDate)}
        </time>
        {isLeader ? (
          // 카드 전체가 상세 페이지 Link이므로 드롭다운 클릭이 네비게이션으로 전파되지 않도록 막는다
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <IconButton
                  type="button"
                  aria-label={`${projectName} 더보기`}
                  icon={<EllipsisVerticalIcon aria-hidden />}
                  className="text-icon-gray-light h-8 w-9 bg-transparent"
                />
              </Dropdown.Trigger>
              <Dropdown.Content align="end" sideOffset={0} className="w-44 gap-1">
                <Dropdown.Item onSelect={() => onDelete?.()}>
                  삭제
                  <TrashIcon className="size-5 stroke-[1.5]" />
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const ProjectCardTitle = ({ host, projectName, startDate, endDate }: ProjectCardTitleProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-detail-xs text-text-basic lg:text-heading-sm lg:text-text-subtle font-bold">{projectName}</h2>
      <div className="lg:hidden">
        <p className="text-detail-xs text-text-subtle font-normal">
          {formatIsoDateToDots(startDate)} - {formatIsoDateToDots(endDate)}
        </p>
        <p className="text-detail-xs text-text-subtle font-normal">{host}</p>
      </div>
      <p className="text-body-base text-text-subtle hidden font-normal lg:block">
        {formatIsoDateToDots(startDate)} - {formatIsoDateToDots(endDate)}
        <span className="text-text-subtler"> ・ </span>
        {host}
      </p>
    </div>
  );
};

const ProjectCardNotice = ({ projectStatus }: { projectStatus: ProjectCardItem['projectStatus'] }) => {
  const isCompleted = projectStatus === 'ARCHIVED';
  const message = isCompleted
    ? '모든 후기 작성이 완료되었습니다! 받은 후기를 확인해보세요.'
    : '팀의 후기가 모두 모이면 받은 후기를 확인할 수 있습니다.';

  return (
    <div
      className={cn(
        'flex items-center rounded-lg px-2 py-1 font-normal lg:h-[37px] lg:px-3',
        'lg:text-body-sm text-[10px] leading-[1.3]',
        'bg-surface-gray-subtle text-text-subtle',
      )}
    >
      {message}
    </div>
  );
};

const ProjectMemberList = ({ members, reviewedCount, totalReviewTargetCount }: ProjectMemberListProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-detail-xs text-text-subtle lg:text-body-base font-normal">
        <span className="lg:hidden">후기 작성 </span>
        <span className="hidden lg:inline">내가 작성한 후기 </span>
        <span className="text-text-primary font-medium lg:font-normal lg:text-inherit">
          {reviewedCount}/{totalReviewTargetCount}
        </span>
      </p>
      <div className="relative hidden min-w-0 overflow-hidden lg:block">
        <ul className="flex flex-nowrap gap-2">
          {members.map((member) => (
            <li key={member.memberId}>
              <ProjectMemberStatusChip member={member} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ProjectMemberStatusChip = ({ member }: { member: ProjectCardMember }) => {
  const isSelf = member.reviewStatus === 'self';
  const isCompleted = member.reviewStatus === 'completed';
  const label = isCompleted ? '완료' : '작성 전';

  return (
    <div className="border-border-gray bg-surface-white flex h-12.25 items-center gap-2 rounded-md border px-4">
      <span className="text-body-base text-text-subtle font-medium whitespace-nowrap">{member.name}</span>
      {isSelf ? null : (
        <span
          className={cn(
            'text-body-xs inline-flex h-5.5 items-center gap-1 rounded-full px-2.5 font-medium whitespace-nowrap',
            isCompleted
              ? 'bg-surface-success-subtler text-text-success'
              : 'bg-surface-warning-subtler text-text-warning',
          )}
        >
          <span
            aria-hidden
            className={cn('size-2 rounded-full', isCompleted ? 'bg-element-success' : 'bg-element-warning')}
          />
          {label}
        </span>
      )}
    </div>
  );
};
