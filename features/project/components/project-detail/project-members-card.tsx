'use client';

import { useState } from 'react';

import { Button } from '@/shared/components/button';
import { SectionCard, SectionInfoRow } from '@/shared/components/section-card';

import type { ProjectMemberResponse, ProjectMemberReviewStatus, ProjectStatus } from '../../project.types';

import { ProjectMemberChip } from '../project-member-chip';

interface Props {
  members: ProjectMemberResponse[];
  projectStatus: ProjectStatus;
  isLeader: boolean;
  myUserId: number;
}

export const ProjectMembersCard = ({ members, projectStatus, isLeader, myUserId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const action = !isLeader ? null : isEditing ? (
    <div className="flex gap-2">
      <Button type="button" variant="tertiary" onClick={() => setIsEditing(false)} className="text-text-basic">
        취소
      </Button>
      <Button
        type="button"
        variant="tertiary"
        onClick={() => setIsEditing(false)}
        className="border-border-gray-dark text-text-basic border"
      >
        저장
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      variant="tertiary"
      onClick={() => setIsEditing(true)}
      className="border-border-gray-dark text-text-subtle w-17 border"
    >
      수정
    </Button>
  );

  return (
    <SectionCard title="팀원 정보" action={action}>
      {isEditing ? (
        <ProjectMembersEditFields members={members} myUserId={myUserId} />
      ) : (
        <ProjectMembersViewFields members={members} myUserId={myUserId} projectStatus={projectStatus} />
      )}
    </SectionCard>
  );
};

interface ViewFieldsProps {
  members: ProjectMemberResponse[];
  myUserId: number;
  projectStatus: ProjectStatus;
}

const ProjectMembersViewFields = ({ members, myUserId, projectStatus }: ViewFieldsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <SectionInfoRow label="참여한 팀원" align="start">
        <ul className="flex flex-wrap gap-2">
          {members.map((member) => {
            const reviewStatus: ProjectMemberReviewStatus =
              member.userId === myUserId ? 'self' : member.reviewWritten === true ? 'completed' : 'writable';

            if (reviewStatus === 'writable') {
              return (
                <li key={member.userId}>
                  <ProjectMemberChip name={member.username} state="writable" onWriteReview={() => undefined} />
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

interface EditFieldsProps {
  members: ProjectMemberResponse[];
  myUserId: number;
}

const ProjectMembersEditFields = ({ members, myUserId }: EditFieldsProps) => (
  <SectionInfoRow label="참여한 팀원" align="start">
    <ul className="flex flex-wrap gap-2">
      {members.map((member) => {
        const isSelf = member.userId === myUserId;
        const chipState: 'completed' | 'self' = isSelf ? 'self' : member.reviewWritten === true ? 'completed' : 'self';

        if (isSelf) {
          return (
            <li key={member.userId}>
              <ProjectMemberChip name={member.username} state={chipState} />
            </li>
          );
        }

        return (
          <li key={member.userId}>
            <ProjectMemberChip name={member.username} state={chipState} removable onRemove={() => undefined} />
          </li>
        );
      })}
    </ul>
  </SectionInfoRow>
);
