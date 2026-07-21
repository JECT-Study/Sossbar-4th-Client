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
  <section className="mb-10 flex w-full flex-col gap-6 pt-8 lg:flex-row lg:justify-between lg:gap-0">
    <div className="grid grid-cols-[60px_minmax(0,1fr)] gap-x-4 gap-y-3 lg:flex lg:flex-row lg:gap-6">
      <ProfileAvatar
        username={profile.username}
        profileImageUrl={profile.profileImageUrl}
        className="size-15 lg:size-25"
      />
      <div className="contents lg:flex lg:flex-1 lg:flex-col lg:gap-4 lg:py-1">
        <div className="col-start-2 row-start-1 flex flex-col justify-center gap-2 lg:col-auto lg:row-auto lg:justify-start">
          <h2 className="text-body-lg text-text-basic lg:text-heading-lg font-bold">{profile.username}</h2>
          <ProfilePositionTags positions={profile.defaultPositions} />
        </div>
        {profile.bio ? (
          <div className="col-span-2 flex flex-col gap-1 lg:col-auto">
            <p className="text-body-sm text-text-basic lg:text-heading-xs font-medium">한 줄 소개</p>
            <p className="text-body-sm text-text-subtle lg:text-body-base font-normal">{profile.bio}</p>
          </div>
        ) : null}
        {profile.links.length > 0 ? (
          <div className="col-span-2 flex flex-col gap-2 lg:col-auto">
            <p className="text-body-sm text-text-basic lg:text-heading-xs font-medium">하드 스킬</p>
            <ProfileLinkList links={profile.links} />
          </div>
        ) : null}
      </div>
    </div>
    {shareActions}
  </section>
);
