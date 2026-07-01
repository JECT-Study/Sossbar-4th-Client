'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { RetryErrorCard } from '@/shared/components/retry-error-card';

import { UserReviewCard } from './review-list/user-review-card';
import { UserReviewCardLoading } from './user-review-card-loading';

interface Props {
  userId: number;
}

export const UserReviewCardGate = ({ userId }: Props) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <RetryErrorCard
          title="후기를 불러오지 못했어요."
          description="연결 상태를 확인한 뒤 다시 시도해 주세요."
          className="border-border-gray flex h-136 w-full flex-col rounded-2xl border"
          actionClassName="w-80"
          onRetry={resetErrorBoundary}
        />
      )}
    >
      <Suspense fallback={<UserReviewCardLoading />}>
        <UserReviewCard userId={userId} />
      </Suspense>
    </ErrorBoundary>
  );
};
