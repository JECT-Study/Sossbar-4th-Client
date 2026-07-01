'use client';

import { ProfileByIdSectionGate, ProfileDetailView } from '@/features/profile';
import { ProjectSection } from '@/features/project';
import { UserReviewContainerBoundary } from '@/features/review';
import { SpectrumCardGate } from '@/features/spectrum';
import { TagCardGate } from '@/features/tag';

interface Props {
  userId: number;
  userLink: string;
}

export const ProfileExamplesClient = ({ userId, userLink }: Props) => {
  return (
    <>
      <ProfileByIdSectionGate userId={userId} />
      <ProfileDetailView
        userId={userId}
        allTabContent={
          <>
            <div className="flex gap-[30px]">
              <TagCardGate userLink={userLink} />
              <SpectrumCardGate userLink={userLink} showDistribution />
            </div>
            <UserReviewContainerBoundary userId={userId} />
          </>
        }
        projectsTabContent={<ProjectSection userId={userId} />}
      />
    </>
  );
};
