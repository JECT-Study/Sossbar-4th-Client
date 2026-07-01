'use client';

import type { FormEvent } from 'react';

import { AccountDeletionModal } from '@/features/auth';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { TextField } from '@/shared/components/text-field';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';

import { useMyProfile } from '../hooks/use-my-profile.query';
import { useUpdateProfile } from '../hooks/use-update-profile.mutation';

export const MypageBasicInfoForm = () => {
  const { data: profile } = useMyProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [marketingAgreed, , , toggleMarketingAgreed] = useBooleanState(profile?.marketingAgree ?? false);
  const [isAccountDeletionOpen, openAccountDeletion, closeAccountDeletion] = useBooleanState(false);

  if (!profile) {
    return null;
  }

  const isDirty = marketingAgreed !== profile.marketingAgree;

  const handleAccountDeletionChange = (open: boolean) => {
    if (open) {
      openAccountDeletion();
      return;
    }

    closeAccountDeletion();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({
      info: { username: profile.username, bio: profile.bio ?? '', marketingAgree: marketingAgreed },
    });
  };

  return (
    <form className="mx-auto flex w-full max-w-[480px] flex-col gap-10 py-20" onSubmit={handleSubmit}>
      <fieldset className="flex flex-col gap-8">
        <legend className="text-heading-base text-text-basic mb-8 font-bold">기본 정보</legend>
        <div className="flex flex-col gap-2">
          <TextField label="이름" name="username" value={profile.username} readOnly autoComplete="off" />
          <TextField label="이메일 주소" name="email" value={profile.email} readOnly autoComplete="off" />
        </div>
      </fieldset>

      <fieldset className="w-full">
        <legend className="text-heading-base text-text-basic mb-8 font-bold">수신 설정</legend>
        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox checked={marketingAgreed} onCheckedChange={toggleMarketingAgreed} />
          <span className="text-detail-sm text-text-basic pt-px leading-normal font-medium">
            (선택) 마케팅 수신 · 홍보 목적의 개인정보 수집 및 이용에 동의합니다.
          </span>
        </label>
      </fieldset>

      <div className="flex w-full flex-col gap-4">
        <Button type="submit" size="medium" className="text-body-xl h-14 w-full py-0" disabled={!isDirty || isPending}>
          정보 수정
        </Button>

        <Button
          variant="tertiary"
          size="medium"
          type="button"
          className="text-text-disabled focus-visible:ring-border-primary text-body-xl h-14 w-full py-0 outline-none focus-visible:ring-2"
          onClick={openAccountDeletion}
        >
          회원 탈퇴
        </Button>
      </div>

      <AccountDeletionModal open={isAccountDeletionOpen} onOpenChange={handleAccountDeletionChange} />
    </form>
  );
};
