import { Suspense } from 'react';

import { ProjectSectionStream } from '@/features/project/components/project-section-stream';
import { ProjectSectionSkeleton } from '@/features/project/components/project-section.skeleton';
import { UserReviewStream } from '@/features/review';
import { UserReviewContainerSkeleton } from '@/features/review/components/user-review-container.skeleton';
import { SoftSkillsCardSkeleton, SoftSkillsCardStream } from '@/features/soft-skills';
import { TagCardSkeleton, TagCardStream } from '@/features/tag';

import { ProfileDetailView } from './profile-detail-view';

interface Props {
  userId: number;
}

export const ProfileDetailStreams = ({ userId }: Props) => (
  <ProfileDetailView
    userId={userId}
    allTabContent={
      <>
        <div className="flex gap-6">
          <Suspense fallback={<TagCardSkeleton />}>
            <TagCardStream userId={userId} />
          </Suspense>
          <Suspense fallback={<SoftSkillsCardSkeleton />}>
            <SoftSkillsCardStream userId={userId} showDistribution />
          </Suspense>
        </div>
        <Suspense fallback={<UserReviewContainerSkeleton />}>
          <UserReviewStream userId={userId} />
        </Suspense>
      </>
    }
    projectsTabContent={
      <Suspense fallback={<ProjectSectionSkeleton />}>
        <ProjectSectionStream userId={userId} />
      </Suspense>
    }
  />
);
