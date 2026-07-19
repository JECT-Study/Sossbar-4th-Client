'use client';

import { useEffect, useState } from 'react';

import { AccountDeletionModal } from '@/features/auth';
import { KakaoTalkIcon } from '@/shared/assets/icons';
import { CharCount } from '@/shared/components/char-count';
import { FileInput, useImagePreview } from '@/shared/components/file-input';
import { Input } from '@/shared/components/input';
import { SectionInfoRow } from '@/shared/components/section-card';
import { Textarea } from '@/shared/components/textarea';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';

import type { MyProfile } from '../profile.types';

import { PROFILE_BIO_MAX_LENGTH } from '../profile.constants';
import { useUpdateProfile } from '../profile.hooks';
import { buildUpdateProfileInfo } from '../profile.lib';
import { MypageCard } from './mypage-card';
import { ProfileAvatar } from './profile-avatar';

interface Props {
  profile: MyProfile;
}

const IMAGE_GUIDE_TEXT = '□ JPG, JPEG, PNG 형식\n□ 최소 100 x 100px';

export const MypageBasicInfoSection = ({ profile }: Props) => {
  const [isEditing, startEditing, stopEditing] = useBooleanState(false);
  const [isDeletionOpen, openDeletion, closeDeletion] = useBooleanState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { previewUrl, onChange: syncPreview } = useImagePreview();

  useEffect(() => {
    syncPreview(imageFile);
  }, [imageFile, syncPreview]);

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
        info: buildUpdateProfileInfo(profile, { username, bio }),
        profileImage: imageFile,
      },
      { onSuccess: () => stopEditing() },
    );
  };

  return (
    <>
      <MypageCard
        title="기본 정보"
        isEditing={isEditing}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        isSaving={isPending}
      >
        <SectionInfoRow label="이미지" align="start">
          {isEditing ? (
            <div className="flex flex-col items-start gap-4 lg:flex-row lg:gap-6">
              <img
                src={previewUrl ?? profile.profileImageUrl ?? '/default-profile.png'}
                alt="프로필 이미지 미리보기"
                className="bg-action-gray-light size-25 shrink-0 rounded-full object-cover lg:mr-8"
              />
              <div className="flex flex-col gap-3">
                <FileInput
                  value={null}
                  onChange={setImageFile}
                  accept="image/jpeg,image/png"
                  label="이미지 업로드하기"
                  className="max-w-none"
                />
                <p className="text-body-sm text-text-subtler whitespace-pre-line">{IMAGE_GUIDE_TEXT}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ProfileAvatar username={profile.username} profileImageUrl={profile.profileImageUrl} />
            </div>
          )}
        </SectionInfoRow>

        <SectionInfoRow
          label={
            <>
              이메일
              <span
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FAE100] text-black"
                aria-hidden
              >
                <KakaoTalkIcon className="size-3.5" />
              </span>
            </>
          }
        >
          {isEditing ? (
            <div className="bg-surface-gray-subtle text-text-disabled text-body-base border-border-gray rounded-md border px-4 py-3">
              {profile.email}
            </div>
          ) : (
            <span className="text-text-basic text-body-base">{profile.email}</span>
          )}
        </SectionInfoRow>

        <SectionInfoRow label="이름">
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
        </SectionInfoRow>

        <SectionInfoRow label="한 줄 소개" align={isEditing ? 'start' : 'center'}>
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
        </SectionInfoRow>
      </MypageCard>

      {process.env.NODE_ENV === 'development' && (
        <>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={openDeletion}
              className="text-body-sm text-text-subtler hover:text-text-subtle underline underline-offset-2"
            >
              회원 탈퇴
            </button>
          </div>

          <AccountDeletionModal
            open={isDeletionOpen}
            onOpenChange={(next) => (next ? openDeletion() : closeDeletion())}
          />
        </>
      )}
    </>
  );
};
