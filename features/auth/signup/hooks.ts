import { useWatch } from 'react-hook-form';

import type { SignupFormData } from './types';
import type { Control, UseFormSetValue } from 'react-hook-form';

import { AGREEMENTS } from './constants';

export const useAgreements = (control: Control<SignupFormData>, setValue: UseFormSetValue<SignupFormData>) => {
  const agreements = useWatch({ control, name: 'agreements' });
  const agreeAll = Object.values(agreements).every(Boolean);

  const handleAgreeAll = (checked: boolean | 'indeterminate') => {
    if (typeof checked !== 'boolean') {
      return;
    }
    AGREEMENTS.forEach(({ key }) => setValue(`agreements.${key}`, checked, { shouldValidate: true }));
  };

  return { agreeAll, handleAgreeAll };
};
