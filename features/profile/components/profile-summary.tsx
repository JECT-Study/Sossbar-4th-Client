import type { ReactNode } from 'react';

import type { PublicProfile } from '../profile.types';

import { ProfileAvatar } from './profile-avatar';

interface Props {
  profile: PublicProfile;
  shareActions?: ReactNode;
}

export const ProfileSummary = ({ profile, shareActions }: Props) => (
  <section className="mb-10 flex w-full flex-row justify-between pt-8">
    <div className="flex flex-row gap-6">
      <ProfileAvatar username={profile.username} profileImageUrl={profile.profileImageUrl} />
      <div className="flex flex-1 flex-col gap-4 py-1">
        <div className="flex items-center gap-2">
          <h2 className="text-heading-lg text-text-basic font-bold">{profile.username}</h2>
          {/* 직무 배지: API 미제공 — 데이터 추가 시 노출 */}
        </div>
        {profile.bio ? (
          <div className="flex flex-col gap-1">
            <p className="text-heading-xs text-text-basic font-medium">한 줄 소개</p>
            <p className="text-body-base text-text-subtle font-normal">{profile.bio}</p>
          </div>
        ) : null}
        {/* 하드 스킬: API 미제공 — 링크 데이터 추가 시 노출 */}
      </div>
    </div>
    {shareActions}
  </section>
);
