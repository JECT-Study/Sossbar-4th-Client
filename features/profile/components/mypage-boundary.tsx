'use client';

import type { ReactNode } from 'react';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { RetryErrorCard } from '@/shared/components/retry-error-card';

import { MypageContent } from './mypage-content';
import { MypageSkeleton } from './mypage-skeleton';

interface Props {
  fallback?: ReactNode;
}

export const MypageBoundary = ({ fallback = <MypageSkeleton /> }: Props) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <RetryErrorCard
          title="정보를 불러오지 못했어요."
          description="연결 상태를 확인한 뒤 다시 시도해 주세요."
          className="mx-auto mt-20 max-w-[480px]"
          onRetry={resetErrorBoundary}
        />
      )}
    >
      <Suspense fallback={fallback}>
        <MypageContent />
      </Suspense>
    </ErrorBoundary>
  );
};
