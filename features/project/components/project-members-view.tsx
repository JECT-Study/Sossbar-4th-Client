'use client';

import { useRouter } from 'next/navigation';

import { SectionInfoRow } from '@/shared/components/section-card';

import type { ProjectMemberResponse, ProjectMemberReviewStatus, ProjectStatus } from '../project.types';

import { buildReviewWriteUrl } from '../project.lib';
import { ProjectMemberChip } from './project-member-chip';

interface Props {
  projectId: number;
  members: ProjectMemberResponse[];
  myUserId: number;
  projectStatus: ProjectStatus;
}

const toReviewStatus = (member: ProjectMemberResponse, myUserId: number): ProjectMemberReviewStatus => {
  if (member.userId === myUserId) {
    return 'self';
  }
  if (member.reviewWritten === true) {
    return 'completed';
  }
  return 'writable';
};

export const ProjectMembersView = ({ projectId, members, myUserId, projectStatus }: Props) => {
  const router = useRouter();

  const handleWriteReview = (member: ProjectMemberResponse) => {
    router.push(
      buildReviewWriteUrl({
        projectId,
        revieweeId: member.userId,
        revieweeName: member.username,
      }),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionInfoRow label="참여한 팀원" align="start">
        <ul className="flex flex-wrap gap-2">
          {members.map((member) => {
            const reviewStatus = toReviewStatus(member, myUserId);
            if (reviewStatus === 'writable') {
              return (
                <li key={member.userId}>
                  <ProjectMemberChip
                    name={member.username}
                    state="writable"
                    onWriteReview={() => handleWriteReview(member)}
                  />
                </li>
              );
            }
            return (
              <li key={member.userId}>
                <ProjectMemberChip name={member.username} state={reviewStatus} />
              </li>
            );
          })}
        </ul>
      </SectionInfoRow>

      {projectStatus === 'IN_PROGRESS' ? (
        <p className="bg-surface-gray-subtle text-text-subtle text-body-sm rounded-lg px-4 py-3">
          * 팀원이 모두 참여했다면 확정을 눌러주세요
        </p>
      ) : null}
    </div>
  );
};
