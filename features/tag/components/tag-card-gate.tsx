'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { RetryErrorCard } from '@/shared/components/retry-error-card';

import { TagCard } from './tag-card';
import { TagCardLoading } from './tag-card-loading';

interface Props {
  userLink: string;
  projectId?: number;
}

export const TagCardGate = ({ userLink, projectId }: Props) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <RetryErrorCard
          title="태그를 불러오지 못했어요."
          description="연결 상태를 확인한 뒤 다시 시도해 주세요."
          className="border-border-gray flex h-auto min-h-[360px] w-full flex-col rounded-2xl border lg:h-[652px] lg:min-h-0 lg:w-[588px]"
          actionClassName="w-full max-w-80"
          onRetry={resetErrorBoundary}
        />
      )}
    >
      <Suspense fallback={<TagCardLoading />}>
        <TagCard userLink={userLink} projectId={projectId} />
      </Suspense>
    </ErrorBoundary>
  );
};
