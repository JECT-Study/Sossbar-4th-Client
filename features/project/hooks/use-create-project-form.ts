import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import type { z } from 'zod';

import { CreateProjectFormSchema } from '../project.schemas';

export type CreateProjectFormInput = z.input<typeof CreateProjectFormSchema>;
export type CreateProjectFormValues = z.output<typeof CreateProjectFormSchema>;

const DEFAULT_VALUES: CreateProjectFormInput = {
  projectName: '',
  host: '',
  image: null,
};

export const useCreateProjectForm = () => {
  const form = useForm<CreateProjectFormInput, unknown, CreateProjectFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(CreateProjectFormSchema),
  });

  const resetForm = useCallback(() => {
    form.reset(DEFAULT_VALUES);
  }, [form]);

  return {
    form,
    resetForm,
  };
};
