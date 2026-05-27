import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import type { AccountDeletionFormData } from '../account-deletion-form.schema';
import type { DeleteAccountPayload } from '../types/account-deletion.types';

import { AccountDeletionFormSchema } from '../account-deletion-form.schema';

interface Params {
  open: boolean;
}

export const useAccountDeletionForm = ({ open }: Params) => {
  const form = useForm<AccountDeletionFormData>({
    resolver: zodResolver(AccountDeletionFormSchema),
    defaultValues: { detail: '' },
    mode: 'onChange',
  });

  const reason = useWatch({ control: form.control, name: 'reason' });
  const isDetailEnabled = reason === 'other';

  useEffect(() => {
    if (isDetailEnabled) {
      return;
    }
    form.clearErrors('detail');
    form.setValue('detail', '', { shouldDirty: false, shouldTouch: false, shouldValidate: false });
  }, [form, isDetailEnabled]);

  const { reset } = form;

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const toPayload = useCallback((data: AccountDeletionFormData): DeleteAccountPayload => {
    const detail = data.reason === 'other' ? data.detail?.trim() : undefined;

    return {
      reason: data.reason,
      ...(detail ? { detail } : {}),
    };
  }, []);

  const canSubmit = useMemo(
    () => form.formState.isValid && !form.formState.isSubmitting,
    [form.formState.isSubmitting, form.formState.isValid],
  );

  return {
    form,
    isDetailEnabled,
    canSubmit,
    toPayload,
  };
};
