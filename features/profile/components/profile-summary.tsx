import type { ReactNode } from 'react';

import { GithubIcon } from '@/shared/assets/icons';

import type { ProfileLinkType, PublicProfile } from '../profile.types';

import { PROFILE_LINK_TYPE_LABELS, PROFILE_POSITION_LABELS } from '../profile.constants';
import { ProfileAvatar } from './profile-avatar';

interface Props {
  profile: PublicProfile;
  shareActions?: ReactNode;
}

const ProfilePositionBadge = ({ label }: { label: string }) => (
  <span className="bg-surface-gray-subtle text-text-subtle text-body-sm inline-flex h-7 items-center rounded-sm px-2 font-medium">
    {label}
  </span>
);

const ProfileLinkIcon = ({ type }: { type: ProfileLinkType }) => {
  if (type === 'GITHUB') {
    return <GithubIcon className="size-5" aria-hidden />;
  }

  if (type === 'BEHANCE') {
    return <span className="text-detail-sm font-bold">Be</span>;
  }

  return <span className="text-detail-sm font-bold">{PROFILE_LINK_TYPE_LABELS[type].slice(0, 2)}</span>;
};

export const ProfileSummary = ({ profile, shareActions }: Props) => (
  <section className="mb-10 flex w-full flex-row justify-between gap-6 pt-8">
    <div className="flex min-w-0 flex-row gap-6">
      <ProfileAvatar username={profile.username} profileImageUrl={profile.profileImageUrl} />
      <div className="flex min-w-0 flex-1 flex-col gap-6 py-1">
        <div className="flex flex-col gap-3">
          <h2 className="text-heading-lg text-text-basic font-bold">{profile.username}</h2>
          {profile.defaultPositions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.defaultPositions.map((position) => (
                <ProfilePositionBadge key={position} label={PROFILE_POSITION_LABELS[position]} />
              ))}
            </div>
          ) : null}
        </div>
        {profile.bio ? (
          <div className="flex flex-col gap-1">
            <p className="text-heading-xs text-text-basic font-medium">한 줄 소개</p>
            <p className="text-body-base text-text-subtle font-normal">{profile.bio}</p>
          </div>
        ) : null}
        {profile.links.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-heading-xs text-text-basic font-medium">하드 스킬</p>
            <div className="flex flex-wrap gap-2">
              {profile.links.map((link) => (
                <a
                  key={link.linkId}
                  href={link.userLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${PROFILE_LINK_TYPE_LABELS[link.userLinkType]} 링크 열기`}
                  className="bg-surface-disabled text-text-basic hover:bg-surface-gray-subtle focus-visible:outline-border-primary inline-flex size-8 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span className="bg-surface-inverse text-text-basic-inverse inline-flex size-6 items-center justify-center rounded-full">
                    <ProfileLinkIcon type={link.userLinkType} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
    {shareActions}
  </section>
);
