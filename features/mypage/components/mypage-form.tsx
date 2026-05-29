'use client';

import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { TextField } from '@/shared/components/text-field';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';

import { AccountDeletionModal } from './account-deletion-modal';
import { useProfile } from '../hooks/use-profile';

export const MypageForm = () => {
  const { data: profile } = useProfile();

  const [marketingAgreed, , , toggleMarketingAgreed] = useBooleanState(false);
  const initialMarketingAgreed = false;
  const isDirty = marketingAgreed !== initialMarketingAgreed;
  const [accountActionsOpen, openAccountActions, closeAccountActions] = useBooleanState(false);

  const handleAccountActionsChange = (open: boolean) => {
    if (open) {
      openAccountActions();
      return;
    }

    closeAccountActions();
  };

  return (
    <form className="mx-auto flex w-full max-w-[480px] flex-col gap-10 py-20" onSubmit={(e) => e.preventDefault()}>
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
        <Button type="submit" size="medium" className="text-body-xl h-14 w-full py-0" disabled={!isDirty}>
          정보 수정
        </Button>

        <Button
          variant="tertiary"
          size="medium"
          type="button"
          className="text-text-disabled focus-visible:ring-border-primary text-body-xl h-14 w-full py-0 outline-none focus-visible:ring-2"
          onClick={openAccountActions}
        >
          회원 탈퇴
        </Button>
      </div>

      <AccountDeletionModal open={accountActionsOpen} onOpenChange={handleAccountActionsChange} />
    </form>
  );
};
