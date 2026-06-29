import { useWatch } from 'react-hook-form';

import type { SignupFormData } from '../types';
import type { Control, UseFormSetValue } from 'react-hook-form';

import { AGREEMENTS } from '../signup-constants';

const defaultAgreements: SignupFormData['agreements'] = {
  age: false,
  terms: false,
  privacy: false,
};

export const useAgreements = (control: Control<SignupFormData>, setValue: UseFormSetValue<SignupFormData>) => {
  const agreements = useWatch({ control, name: 'agreements' }) ?? defaultAgreements;
  const agreeAll = AGREEMENTS.every(({ key }) => agreements[key] === true);

  const handleAgreeAll = (checked: boolean | 'indeterminate') => {
    if (checked !== true && checked !== false) {
      return;
    }
    AGREEMENTS.forEach(({ key }) =>
      setValue(`agreements.${key}`, checked, { shouldValidate: true, shouldTouch: true, shouldDirty: true }),
    );
  };

  return { agreeAll, handleAgreeAll };
};
