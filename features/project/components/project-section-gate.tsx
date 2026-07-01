'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { RetryErrorCard } from '@/shared/components/retry-error-card';

import { ProjectSection } from './project-section';
import { ProjectSectionSkeleton } from './project-section.skeleton';

interface Props {
  userLink: string;
}

export const ProjectSectionGate = ({ userLink }: Props) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <RetryErrorCard
          title="프로젝트 정보를 불러오지 못했어요."
          description="연결 상태를 확인한 뒤 다시 시도해 주세요."
          onRetry={resetErrorBoundary}
        />
      )}
    >
      <Suspense fallback={<ProjectSectionSkeleton />}>
        <ProjectSection userLink={userLink} />
      </Suspense>
    </ErrorBoundary>
  );
};
