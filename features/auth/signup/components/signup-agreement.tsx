import { Controller } from 'react-hook-form';

import { Checkbox } from '@/shared/components/checkbox';

import type { SignupFormData } from '../types';
import type { Control, UseFormSetValue } from 'react-hook-form';

import { AgreementItem } from './agreement-item';
import { AGREEMENTS } from '../constants';
import { useAgreements } from '../hooks';

interface Props {
  control: Control<SignupFormData>;
  setValue: UseFormSetValue<SignupFormData>;
}

export const SignupAgreement = ({ control, setValue }: Props) => {
  const { agreeAll, handleAgreeAll } = useAgreements(control, setValue);

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
            <AgreementItem agreement={agreement} checked={field.value} onChange={field.onChange} />
          )}
        />
      ))}
    </div>
  );
};
