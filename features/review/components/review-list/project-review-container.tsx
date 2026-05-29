'use client';

import { ReviewListCard } from './review-list-card';
import { ReviewListEmpty } from './review-list-empty';
import { useProjectReviews } from '../../api/queries';

type ProjectReviewContainerProps = {
  userId: number;
  projectId: number;
  isMyProfile: boolean;
};

export const ProjectReviewContainer = ({ userId, projectId, isMyProfile }: ProjectReviewContainerProps) => {
  const { data: reviews = [], isError } = useProjectReviews(userId, projectId);

  if (isError) {
    return <ReviewListEmpty title="후기를 불러오지 못했습니다." />;
  }

  if (reviews.length === 0) {
    if (!isMyProfile) {
      return <ReviewListEmpty title="아직 도착한 후기가 없어요." />;
    }

    return (
      <ReviewListEmpty
        title="아직 도착한 후기가 없어요."
        // 추후 버튼에 기능 연결할 예정
        // description="링크를 공유해 볼까요?"
        // action={
        //   <Button type="button" variant="secondary" size="medium">
        //     초대 링크 공유
        //   </Button>
        // }
      />
    );
  }

  return <ReviewListCard isMyProfile={isMyProfile} reviews={reviews} showThumbnail={false} />;
};
