'use client';

import { ProfileByIdSectionGate, ProfileDetailView } from '@/features/profile';
import { ProjectSection } from '@/features/project';
import { UserReviewContainerBoundary } from '@/features/review';
import { SoftSkillsCardBoundary } from '@/features/soft-skills';
import { TagCardBoundary } from '@/features/tag';

interface Props {
  userId: number;
}

export const ProfileExamplesClient = ({ userId }: Props) => {
  return (
    <>
      <ProfileByIdSectionGate userId={userId} />
      <ProfileDetailView
        userId={userId}
        allTabContent={
          <>
            <div className="flex gap-[30px]">
              <TagCardBoundary userId={userId} />
              <SoftSkillsCardBoundary userId={userId} showDistribution />
            </div>
            <UserReviewContainerBoundary userId={userId} />
          </>
        }
        projectsTabContent={<ProjectSection userId={userId} />}
      />
    </>
  );
};
