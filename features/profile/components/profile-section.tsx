'use client';

import { Avatar } from 'radix-ui';
import { useCallback, useState } from 'react';

import { buildProfileShareClipboardText } from '@/features/profile/lib/build-profile-share-clipboard-text';
import { EditIcon, PlusIcon, ShareIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { TextareaLegacy } from '@/shared/components/textarea-legacy';
import { cn } from '@/shared/lib/cn';
import { copyTextToClipboard } from '@/shared/lib/copy-text-to-clipboard';

import { ProfileShareTooltip } from './profile-share-tooltip';

const MAX_NICKNAME = 20;
const MAX_BIO = 50;
const PROFILE_IMAGE_SRC = '/default-profile.png';

/** 목 UI 표시명 — API 연동 전까지 프로필 헤더·공유 텍스트에 공통 사용 */
const MOCK_DISPLAY_NAME = '이름';

const ProfileAvatar = () => {
  return (
    <Avatar.Root className="bg-action-gray-light flex size-25 shrink-0 items-center justify-center overflow-hidden rounded-full">
      <Avatar.Image className="h-full w-full object-cover" src={PROFILE_IMAGE_SRC} alt="프로필 이미지" />
      <Avatar.Fallback className="text-heading-lg text-text-subtle font-bold" delayMs={600}>
        {MOCK_DISPLAY_NAME}
      </Avatar.Fallback>
    </Avatar.Root>
  );
};

type ProfileSectionProps = {
  isMyProfile: boolean;
  userId: number;
};

export const ProfileSection = ({ isMyProfile, userId }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [isShareTooltipOpen, setIsShareTooltipOpen] = useState(false);
  const [shareTooltipMessage, setShareTooltipMessage] = useState('링크가 복사되었습니다');

  const closeShareTooltip = useCallback(() => setIsShareTooltipOpen(false), []);

  const handleShareProfile = async () => {
    if (!Number.isFinite(userId) || userId <= 0) {
      return;
    }

    const copied = await copyTextToClipboard(buildProfileShareClipboardText(userId));
    setShareTooltipMessage(copied ? '링크가 복사되었습니다' : '링크 복사에 실패했습니다');
    setIsShareTooltipOpen(true);
  };

  const handleSubmitProfile = () => {
    setIsEditing(false);
  };

  if (isMyProfile && isEditing) {
    return (
      <section className="mt-15.5 mb-8">
        <div className="flex items-start justify-between">
          <h2 className="text-heading-lg text-text-basic font-bold">프로필 수정</h2>
          <div className="flex gap-2">
            <Button variant="tertiary" size="medium" onClick={() => setIsEditing(false)}>
              취소
            </Button>
            <Button variant="secondary" size="medium" onClick={handleSubmitProfile}>
              저장
            </Button>
          </div>
        </div>
        <div className="mt-6 flex gap-6">
          <div className="relative shrink-0">
            <ProfileAvatar />
            <button className="absolute top-18.5 left-18.5 h-fit w-fit rounded-full" aria-label="프로필 이미지 변경">
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex w-full max-w-120 flex-1 flex-col gap-2">
            <div className="flex flex-col">
              <label className="text-heading-xs text-text-subtle mb-2 font-bold">
                닉네임 <span className="text-text-tertiary">*</span>
              </label>
              <Input
                name="nickname"
                className="max-w-full"
                placeholder="내용을 입력하세요"
                maxLength={MAX_NICKNAME}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <TextareaLegacy
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
      </section>
    );
  }

  return (
    <section className="mt-15.5 mb-8 flex w-full flex-row">
      <div className="flex h-[104px] w-[540px] flex-row gap-6">
        <ProfileAvatar />
        <div className="flex flex-1 flex-col">
          <h2 className="text-heading-lg text-text-basic pb-2 font-bold">{MOCK_DISPLAY_NAME}</h2>
          <p className="text-heading-xs text-text-subtle font-normal">
            협업을 즐기는 프론트엔드 개발자입니다. 협업을 즐기는 프론트엔드 여기까지 공백 포함 50자
          </p>
        </div>
      </div>
      {isMyProfile ? (
        <div className="ml-auto">
          <Button variant="secondary" size="medium" leftIcon={<EditIcon />} onClick={() => setIsEditing(true)}>
            프로필 수정
          </Button>
          <div className="relative ml-2 inline-flex">
            <Button
              type="button"
              variant="primary"
              size="medium"
              leftIcon={<ShareIcon aria-hidden />}
              className={cn(
                isShareTooltipOpen &&
                  'bg-button-primary-fill-pressed hover:bg-button-primary-fill-pressed focus:bg-button-primary-fill-pressed active:bg-button-primary-fill-pressed',
              )}
              onClick={() => void handleShareProfile()}
            >
              내 프로필 공유하기
            </Button>
            <ProfileShareTooltip open={isShareTooltipOpen} onClose={closeShareTooltip} message={shareTooltipMessage} />
          </div>
        </div>
      ) : null}
    </section>
  );
};
