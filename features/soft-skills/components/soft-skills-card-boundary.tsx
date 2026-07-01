'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { RetryErrorCard } from '@/shared/components/retry-error-card';

import { SoftSkillsCard } from './soft-skills-card';
import { SoftSkillsCardSkeleton } from './soft-skills-card.skeleton';

interface Props {
  userLink: string;
  projectId?: number;
  showDistribution?: boolean;
}

export const SoftSkillsCardBoundary = ({ userLink, projectId, showDistribution }: Props) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <RetryErrorCard
          title="스펙트럼을 불러오지 못했어요."
          description="연결 상태를 확인한 뒤 다시 시도해 주세요."
          className="border-border-gray flex h-[652px] w-[588px] flex-col rounded-2xl border"
          actionClassName="w-80"
          onRetry={resetErrorBoundary}
        />
      )}
    >
      <Suspense fallback={<SoftSkillsCardSkeleton />}>
        <SoftSkillsCard userLink={userLink} projectId={projectId} showDistribution={showDistribution} />
      </Suspense>
    </ErrorBoundary>
  );
};
