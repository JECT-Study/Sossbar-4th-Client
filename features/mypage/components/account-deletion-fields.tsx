'use client';

import { Controller } from 'react-hook-form';

import { TextareaField } from '@/shared/components/textarea-field/textarea-field';

import type { AccountDeletionFormData } from '../account-deletion-form.schema';
import type { Control, UseFormRegister } from 'react-hook-form';

import { WITHDRAW_REASON_OPTIONS } from '../account-deletion.constants';
import { WithdrawReasonRadioGroup } from './withdraw-reason-radio-group';

interface AccountDeletionFieldsProps {
  control: Control<AccountDeletionFormData>;
  register: UseFormRegister<AccountDeletionFormData>;
  isDetailEnabled: boolean;
  detailErrorMessage?: string;
}

export const AccountDeletionFields = ({
  control,
  register,
  isDetailEnabled,
  detailErrorMessage,
}: AccountDeletionFieldsProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
      <Controller
        name="reason"
        control={control}
        render={({ field }) => (
          <WithdrawReasonRadioGroup
            name="withdraw-reason"
            options={WITHDRAW_REASON_OPTIONS}
            value={field.value}
            onValueChange={field.onChange}
            ariaLabel="탈퇴 사유 선택"
          />
        )}
      />

      <TextareaField
        label="상세 사유"
        placeholder="탈퇴 사유를 입력해주세요."
        disabled={!isDetailEnabled}
        textareaClassName="min-h-[144px] max-h-[144px]"
        className="w-full max-w-none shrink-0"
        errorMessage={detailErrorMessage}
        maxLength={200}
        {...register('detail')}
      />
    </div>
  );
};
