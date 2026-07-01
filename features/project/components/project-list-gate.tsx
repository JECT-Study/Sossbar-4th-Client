'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useMyProfile } from '@/features/profile';
import { RetryErrorCard } from '@/shared/components/retry-error-card';

import type { FetchMyProjectsParams } from '../project.types';

import { ProjectListCard } from './project-list-card';
import { ProjectListLoading } from './project-list-loading';
import { ProjectListSignInPrompt } from './project-list-sign-in-prompt';

interface Props {
  params: FetchMyProjectsParams;
}

export const ProjectListGate = ({ params }: Props) => {
  const { data: profile } = useMyProfile();
  const { reset } = useQueryErrorResetBoundary();

  if (profile == null) {
    return <ProjectListSignInPrompt />;
  }

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <RetryErrorCard
          title="프로젝트 목록을 불러오지 못했어요."
          description="연결 상태를 확인한 뒤 다시 시도해 주세요."
          onRetry={resetErrorBoundary}
        />
      )}
    >
      <Suspense fallback={<ProjectListLoading />}>
        <ProjectListCard params={params} />
      </Suspense>
    </ErrorBoundary>
  );
};
