'use client';

import { useState } from 'react';

import { KakaoTalkIcon } from '@/shared/assets/icons';
import { CharCount } from '@/shared/components/char-count';
import { ImageFileInput } from '@/shared/components/file-input';
import { Input } from '@/shared/components/input';
import { Textarea } from '@/shared/components/textarea';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';

import type { Profile } from '../profile.types';

import { PROFILE_BIO_MAX_LENGTH } from '../profile.constants';
import { useUpdateProfile } from '../profile.hooks';
import { MypageCard } from './mypage-card';
import { MypageInfoRow } from './mypage-info-row';
import { ProfileAvatar } from './profile-avatar';

interface Props {
  profile: Profile;
}

const IMAGE_GUIDE_TEXT = 'JPG, JPEG, PNG 형식\n최소 100px X 100px';

export const MypageBasicInfoSection = ({ profile }: Props) => {
  const [isEditing, startEditing, stopEditing] = useBooleanState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const resetDraft = () => {
    setUsername(profile.username);
    setBio(profile.bio ?? '');
    setImageFile(null);
  };

  const handleEdit = () => {
    resetDraft();
    startEditing();
  };

  const handleCancel = () => {
    resetDraft();
    stopEditing();
  };

  const handleSave = () => {
    updateProfile(
      {
        info: { username, bio, marketingAgree: profile.marketingAgree },
        profileImage: imageFile,
      },
      { onSuccess: () => stopEditing() },
    );
  };

  return (
    <MypageCard
      title="기본 정보"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      isSaving={isPending}
    >
      <MypageInfoRow label="이미지" align="start">
        {isEditing ? (
          <div className="flex items-start gap-6">
            <ImageFileInput value={imageFile} onChange={setImageFile} className="max-w-none" />
            <p className="text-body-sm text-text-subtler whitespace-pre-line">{IMAGE_GUIDE_TEXT}</p>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <ProfileAvatar username={profile.username} profileImageUrl={profile.profileImageUrl} />
            <p className="text-body-sm text-text-subtler whitespace-pre-line">{IMAGE_GUIDE_TEXT}</p>
          </div>
        )}
      </MypageInfoRow>

      <MypageInfoRow label="이메일">
        {isEditing ? (
          <div className="bg-surface-gray-subtle text-text-subtle text-body-base flex items-center gap-2 rounded-md px-4 py-3">
            <KakaoTalkIcon className="size-6 shrink-0" aria-hidden />
            <span>{profile.email}</span>
          </div>
        ) : (
          <div className="text-text-basic text-body-base flex items-center gap-2">
            <KakaoTalkIcon className="size-6 shrink-0" aria-hidden />
            <span>{profile.email}</span>
          </div>
        )}
      </MypageInfoRow>

      <MypageInfoRow label="이름">
        {isEditing ? (
          <Input
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="off"
          />
        ) : (
          <span className="text-text-basic text-body-base">{profile.username}</span>
        )}
      </MypageInfoRow>

      <MypageInfoRow label="한 줄 소개" align={isEditing ? 'start' : 'center'}>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              name="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value.slice(0, PROFILE_BIO_MAX_LENGTH))}
              rows={3}
            />
            <CharCount current={bio.length} max={PROFILE_BIO_MAX_LENGTH} />
          </div>
        ) : (
          <span className="text-text-basic text-body-base">{profile.bio ?? '-'}</span>
        )}
      </MypageInfoRow>
    </MypageCard>
  );
};
