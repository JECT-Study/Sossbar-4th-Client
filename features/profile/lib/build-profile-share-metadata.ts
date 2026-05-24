import type { Metadata } from 'next';

import { buildProfileShareDescription, getProfileShareDisplayName, PROFILE_SHARE_TITLE } from './profile-share-content';

export const buildProfileShareMetadata = (userId: number, userName?: string): Metadata => {
  const displayName = userName?.trim() || getProfileShareDisplayName(userId);
  const description = buildProfileShareDescription(displayName);
  const profilePath = `/profile/${userId}`;

  return {
    title: PROFILE_SHARE_TITLE,
    description,
    alternates: {
      canonical: profilePath,
    },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      title: PROFILE_SHARE_TITLE,
      description,
      url: profilePath,
      siteName: 'Sossbar',
      images: [
        {
          url: '/Sossbar-logo2.svg',
          alt: 'Sossbar',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: PROFILE_SHARE_TITLE,
      description,
    },
  };
};
