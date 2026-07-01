import { PROFILE_SHARE_TITLE } from '@/features/profile/profile.lib';

import type { Metadata } from 'next';

import { getSiteOrigin } from './get-site-origin';

export const SHARE_OG_IMAGE_PATH = '/Sossbar_logo.png';

const resolveSiteOrigin = (): string => getSiteOrigin() || 'https://sossbar.com';

export const buildShareOgImageUrl = (): string => `${resolveSiteOrigin()}${SHARE_OG_IMAGE_PATH}`;

interface BuildShareOgMetadataParams {
  description: string;
  path: string;
  title?: string;
}

export const buildShareOgMetadata = ({
  description,
  path,
  title = PROFILE_SHARE_TITLE,
}: BuildShareOgMetadataParams): Metadata => {
  const origin = resolveSiteOrigin();
  const imageUrl = buildShareOgImageUrl();
  const pageUrl = `${origin}${path.startsWith('/') ? path : `/${path}`}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      title,
      description,
      url: pageUrl,
      siteName: 'Sossbar',
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Sossbar',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
};
