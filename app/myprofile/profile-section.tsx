'use client';

import { Avatar } from 'radix-ui';
import { useState } from 'react';

import { CameraIcon, EditIcon, ShareIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { PageContainer } from '@/shared/components/page-container';
import { Textarea } from '@/shared/components/textarea';

const MAX_NICKNAME = 20;
const MAX_BIO = 50;
const PROFILE_IMAGE_SRC = '/default-profile.png';

const ProfileAvatar = () => {
  return (
    <Avatar.Root className="bg-action-gray-light flex size-25 shrink-0 items-center justify-center overflow-hidden rounded-full">
      <Avatar.Image className="h-full w-full object-cover" src={PROFILE_IMAGE_SRC} alt="프로필 이미지" />
      <Avatar.Fallback className="text-heading-lg text-text-subtle font-bold" delayMs={600}>
        이름
      </Avatar.Fallback>
    </Avatar.Root>
  );
};

export const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');

  if (isEditing) {
    return (
      <PageContainer className="mt-15.5 mb-8">
        <div className="flex items-start justify-between">
          <h2 className="text-heading-lg text-text-basic font-bold">프로필 수정</h2>
          <div className="flex gap-2">
            <Button variant="tertiary" size="medium" onClick={() => setIsEditing(false)}>
              취소
            </Button>
            <Button variant="secondary" size="medium" onClick={() => setIsEditing(false)}>
              저장
            </Button>
          </div>
        </div>
        <div className="mt-6 flex gap-6">
          <div className="relative shrink-0">
            <ProfileAvatar />
            <button
              className="border-icon-gray-fill absolute top-14.5 left-16.75 flex h-10.5 w-10.5 items-center justify-center rounded-full border bg-white"
              aria-label="프로필 이미지 변경"
            >
              <CameraIcon className="text-icon-gray-fill h-6 w-6" />
            </button>
          </div>
          <div className="flex w-full max-w-120 flex-1 flex-col gap-2">
            <div className="flex flex-col">
              <label className="text-heading-xs text-text-subtle mb-2 font-bold">
                닉네임 <span className="text-text-tertiary">*</span>
              </label>
              <Input
                className="max-w-full"
                placeholder="내용을 입력하세요"
                maxLength={MAX_NICKNAME}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <Textarea
              className="max-w-full"
              label="한 줄 소개"
              placeholder="협업을 즐기는 프론트엔드 개발자입니다."
              maxLength={MAX_BIO}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              currentCount={bio.length}
              totalCount={MAX_BIO}
            />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="mt-15.5 mb-8 flex w-full flex-row">
      <div className="flex h-[104px] w-[540px] flex-row gap-6">
        <ProfileAvatar />
        <div className="flex flex-1 flex-col">
          <h2 className="text-heading-lg text-text-basic pb-2 font-bold">이름</h2>
          <p className="text-heading-xs text-text-subtle font-normal">
            협업을 즐기는 프론트엔드 개발자입니다. 협업을 즐기는 프론트엔드 여기까지 공백 포함 50자
          </p>
        </div>
      </div>
      <div className="ml-auto">
        <Button variant="secondary" size="medium" leftIcon={<EditIcon />} onClick={() => setIsEditing(true)}>
          프로필 수정
        </Button>
        <Button variant="primary" size="medium" leftIcon={<ShareIcon />} className="ml-2">
          내 프로필 공유하기
        </Button>
      </div>
    </PageContainer>
  );
};
