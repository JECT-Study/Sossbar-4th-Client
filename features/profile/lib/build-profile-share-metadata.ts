import { buildShareOgMetadata } from '@/shared/lib/build-share-metadata';

import type { Metadata } from 'next';

import { buildProfileShareDescription } from './profile-share-content';

export const buildProfileShareMetadata = (userId: number, userName?: string, path?: string): Metadata => {
  const displayName = userName?.trim() || '회원';
  const description = buildProfileShareDescription(displayName);
  const profilePath = path ?? `/profile/${userId}`;

  return buildShareOgMetadata({
    description,
    path: profilePath,
  });
};
