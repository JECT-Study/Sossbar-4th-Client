'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { RetryErrorCard } from '@/shared/components/retry-error-card';

import { ProfileByIdSection } from './profile-by-id-section';
import { ProfileSectionLoading } from './profile-section-loading';

interface Props {
  userLink: string;
  isMyProfile?: boolean;
}

export const ProfileByIdSectionGate = ({ userLink, isMyProfile }: Props) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <RetryErrorCard
          title="프로필을 불러오지 못했어요."
          description="연결 상태를 확인한 뒤 다시 시도해 주세요."
          className="mt-15.5 mb-8 min-h-fit"
          actionClassName="w-80"
          onRetry={resetErrorBoundary}
        />
      )}
    >
      <Suspense fallback={<ProfileSectionLoading />}>
        <ProfileByIdSection userLink={userLink} isMyProfile={isMyProfile} />
      </Suspense>
    </ErrorBoundary>
  );
};
