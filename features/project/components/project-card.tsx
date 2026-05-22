'use client';

import Image from 'next/image';

import { ProjectMemberChip } from '@/features/project/components/project-member-chip';
import { ProjectStateBadge } from '@/features/project/components/project-state-badge';
import { CopyIcon, EditIcon, EllipsisVerticalIcon, RoundCheckIcon, TrashIcon } from '@/shared/assets/icons';
import { Alert } from '@/shared/components/alert';
import { Button, IconButton } from '@/shared/components/button';
import { Dropdown } from '@/shared/components/dropdown';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

const DEFAULT_PROJECT_IMAGE = '/default.png';

interface ProjectCardMember {
  memberId: number;
  name: string;
  reviewStatus: 'writable' | 'completed' | 'self';
}

interface ProjectCardItem {
  projectId: number;
  projectName: string;
  host: string;
  startDate: string;
  endDate: string;
  projectLink: string;
  projectImage: string | null;
  projectStatus: 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  myMemberStatus: 'LEADER' | 'MEMBER';
  members: readonly ProjectCardMember[];
}

interface ProjectCardProps {
  project: ProjectCardItem;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const isLeader = project.myMemberStatus === 'LEADER';
  const handleWriteReview = () => undefined;

  return (
    <article className="flex flex-row gap-6 p-6">
      <div className="relative h-[214px] w-[286px] overflow-hidden rounded-2xl">
        <Image
          src={project.projectImage || DEFAULT_PROJECT_IMAGE}
          alt={`${project.projectName} 이미지`}
          fill
          sizes="(max-width: 768px) 100vw, 265px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-2">
            <ProjectStateBadge variant="waiting" />
            <ProjectStateBadge variant="leader" />
          </div>
          <div className="flex items-center gap-1">
            <time className="text-detail-base text-text-subtle font-normal" dateTime={project.startDate}>
              {formatIsoDateToDots(project.startDate)}
            </time>
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <IconButton
                  type="button"
                  aria-label={`${project.projectName} 더보기`}
                  icon={<EllipsisVerticalIcon aria-hidden />}
                  className="text-icon-gray-light h-8 w-8 bg-transparent"
                />
              </Dropdown.Trigger>
              <Dropdown.Content align="end" sideOffset={0} className="w-44 gap-1">
                {!!isLeader && (
                  <Dropdown.Item>
                    수정 <EditIcon className="size-5" />
                  </Dropdown.Item>
                )}
                <Dropdown.Item>
                  삭제
                  <TrashIcon className="size-5 stroke-[1.5]" />
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </div>
        </div>
        <div>
          <h2 className="text-heading-sm text-text-subtle font-bold">{project.projectName}</h2>
          <p className="text-detail-base text-text-subtle mt-1 font-normal">{project.host}</p>
        </div>
        {isLeader ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="medium"
              leftIcon={<CopyIcon aria-hidden className="size-4" />}
            >
              초대 링크 복사
            </Button>
            {project.projectStatus === 'IN_PROGRESS' ? (
              <Button
                type="button"
                variant="primary"
                size="medium"
                leftIcon={<RoundCheckIcon aria-hidden className="size-4" />}
              >
                우리 팀 확정하기
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="medium"
                disabled
                leftIcon={<RoundCheckIcon aria-hidden className="size-4" />}
                className="bg-button-primary-fill-pressed text-text-basic-inverse hover:bg-button-primary-fill-pressed hover:text-text-basic-inverse focus:bg-button-primary-fill-pressed focus:text-text-basic-inverse active:bg-button-primary-fill-pressed active:text-text-basic-inverse"
              >
                팀 확정 완료
              </Button>
            )}
          </div>
        ) : (
          <Alert className="w-full" />
        )}
        <div>
          <p className="text-detail-base text-text-subtle font-normal">팀원 {project.members.length}명</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.members.map((member) => (
              <ul key={member.memberId}>
                {member.reviewStatus === 'writable' ? (
                  <ProjectMemberChip name={member.name} state={member.reviewStatus} onWriteReview={handleWriteReview} />
                ) : (
                  <ProjectMemberChip name={member.name} state={member.reviewStatus} />
                )}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
