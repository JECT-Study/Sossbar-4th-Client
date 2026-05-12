import Link from 'next/link';
import { Controller, useWatch } from 'react-hook-form';

import { Checkbox } from '@/shared/components/checkbox';

import type { SignupFormData } from '../types';
import type { Control, UseFormSetValue } from 'react-hook-form';

import { AGREEMENTS } from '../constants';

interface Props {
  control: Control<SignupFormData>;
  setValue: UseFormSetValue<SignupFormData>;
}

export const SignupAgreement = ({ control, setValue }: Props) => {
  const agreements = useWatch({ control, name: 'agreements' });
  const agreeAll = Object.values(agreements).every(Boolean);

  const handleAgreeAll = (checked: boolean | 'indeterminate') => {
    if (typeof checked !== 'boolean') {
      return;
    }
    AGREEMENTS.forEach(({ key }) => setValue(`agreements.${key}`, checked, { shouldValidate: true }));
  };

  return (
    <div className="border-border-gray-light mt-[40px] space-y-4 rounded-xl border p-4">
      <label className="border-border-gray-light flex cursor-pointer items-center gap-3 border-b pb-4">
        <Checkbox checked={agreeAll} onCheckedChange={handleAgreeAll} />
        <span className="text-detail-base font-bold">모두 동의합니다.</span>
      </label>
      {AGREEMENTS.map((agreement) => (
        <Controller
          key={agreement.key}
          control={control}
          name={`agreements.${agreement.key}`}
          render={({ field }) => (
            <label className="flex cursor-pointer items-center gap-3">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              <span className="text-text-basic text-[14px]">
                {'url' in agreement ? (
                  <>
                    {agreement.required ? '(필수)' : '(선택)'}{' '}
                    <Link
                      href={agreement.url}
                      className="font-medium underline underline-offset-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {agreement.linkLabel}
                    </Link>
                    {agreement.suffix}
                  </>
                ) : (
                  <>
                    {agreement.required ? '(필수)' : '(선택)'} {agreement.label}
                  </>
                )}
              </span>
            </label>
          )}
        />
      ))}
    </div>
  );
};
