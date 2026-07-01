'use client';

import { SectionInfoRow } from '@/shared/components/section-card';
import { cn } from '@/shared/lib/cn';

import type { ProjectMemberResponse } from '../project.types';

import { ProjectMemberChip } from './project-member-chip';

interface Props {
  members: ProjectMemberResponse[];
  myUserId: number;
  pendingRemovalIds: Set<number>;
  onToggleRemoval: (userId: number) => void;
}

export const ProjectMembersEdit = ({ members, myUserId, pendingRemovalIds, onToggleRemoval }: Props) => {
  return (
    <SectionInfoRow label="참여한 팀원" align="start">
      <ul className="flex flex-wrap gap-2">
        {members.map((member) => {
          const isSelf = member.userId === myUserId;
          const isPendingRemoval = pendingRemovalIds.has(member.userId);

          if (isSelf) {
            return (
              <li key={member.userId}>
                <ProjectMemberChip name={member.username} state="self" showReviewButton={false} />
              </li>
            );
          }

          // 수정 mode에서는 review 버튼을 숨기고, 상태에 관계없이 삭제 버튼만 노출
          const chipState = member.reviewWritten === true ? 'completed' : 'self';

          return (
            <li key={member.userId} className={cn(isPendingRemoval && 'opacity-50')}>
              <ProjectMemberChip
                name={member.username}
                state={chipState}
                showReviewButton={false}
                removable
                onRemove={() => onToggleRemoval(member.userId)}
              />
            </li>
          );
        })}
      </ul>
    </SectionInfoRow>
  );
};
