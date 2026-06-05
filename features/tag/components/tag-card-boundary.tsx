'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { RetryErrorCard } from '@/shared/components/retry-error-card';

import { TagCard } from './tag-card';
import { TagCardSkeleton } from './tag-card.skeleton';

interface Props {
  userId: number;
  projectId?: number;
  collapsible?: boolean;
}

export const TagCardBoundary = ({ userId, projectId, collapsible }: Props) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <RetryErrorCard
          title="태그를 불러오지 못했어요."
          description="연결 상태를 확인한 뒤 다시 시도해 주세요."
          className="border-border-gray flex h-[652px] w-[588px] flex-col rounded-2xl border"
          actionClassName="w-80"
          onRetry={resetErrorBoundary}
        />
      )}
    >
      <Suspense fallback={<TagCardSkeleton />}>
        <TagCard userId={userId} projectId={projectId} collapsible={collapsible} />
      </Suspense>
    </ErrorBoundary>
  );
};
