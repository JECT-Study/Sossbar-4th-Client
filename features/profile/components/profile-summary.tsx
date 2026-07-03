import type { ReactNode } from 'react';

import type { PublicProfile } from '../profile.types';

import { ProfileAvatar } from './profile-avatar';
import { ProfileLinkList } from './profile-link-list';
import { ProfilePositionTags } from './profile-position-tags';

interface Props {
  profile: PublicProfile;
  shareActions?: ReactNode;
}

export const ProfileSummary = ({ profile, shareActions }: Props) => (
  <section className="mb-10 flex w-full flex-row justify-between pt-8">
    <div className="flex flex-row gap-6">
      <ProfileAvatar username={profile.username} profileImageUrl={profile.profileImageUrl} />
      <div className="flex flex-1 flex-col gap-4 py-1">
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-lg text-text-basic font-bold">{profile.username}</h2>
          <ProfilePositionTags positions={profile.defaultPositions} />
        </div>
        {profile.bio ? (
          <div className="flex flex-col gap-1">
            <p className="text-heading-xs text-text-basic font-medium">한 줄 소개</p>
            <p className="text-body-base text-text-subtle font-normal">{profile.bio}</p>
          </div>
        ) : null}
        {profile.links.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-heading-xs text-text-basic font-medium">하드 스킬</p>
            <ProfileLinkList links={profile.links} />
          </div>
        ) : null}
      </div>
    </div>
    {shareActions}
  </section>
);
