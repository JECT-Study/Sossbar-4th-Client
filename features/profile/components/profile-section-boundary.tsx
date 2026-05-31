'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ProfileSection } from './profile-section';
import { ProfileSectionError } from './profile-section-error';
import { ProfileSectionSkeleton } from './profile-section-skeleton';

interface Props {
  userId: number;
}

export const ProfileSectionBoundary = ({ userId }: Props) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary onReset={reset} fallbackRender={ProfileSectionError}>
        <Suspense fallback={<ProfileSectionSkeleton />}>
          <ProfileSection userId={userId} />
        </Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
