'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { RetryErrorState } from '@/shared/components/retry-error-state';

import { ProfileSection } from './profile-section';
import { ProfileSectionSkeleton } from './profile-section-skeleton';

interface Props {
  userId: number;
}

export const ProfileSectionBoundary = ({ userId }: Props) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <RetryErrorState
            title="프로필을 불러오지 못했어요."
            description="연결 상태를 확인한 뒤 다시 시도해 주세요."
            className="mt-15.5 mb-8 min-h-fit"
            actionClassName="w-80"
            onRetry={resetErrorBoundary}
          />
        )}
      >
        <Suspense fallback={<ProfileSectionSkeleton />}>
          <ProfileSection userId={userId} />
        </Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
