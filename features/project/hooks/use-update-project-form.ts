import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import type { ProjectRequest } from '../types';
import type { z } from 'zod';

import { UpdateProjectFormSchema } from '../project.schemas';

export type UpdateProjectFormValues = z.infer<typeof UpdateProjectFormSchema>;

interface Params {
  defaultProjectValues: ProjectRequest;
}

export const useUpdateProjectForm = ({ defaultProjectValues }: Params) => {
  const form = useForm<UpdateProjectFormValues>({
    defaultValues: {
      projectName: defaultProjectValues.projectName,
      host: defaultProjectValues.host,
      image: null,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(UpdateProjectFormSchema),
  });

  const resetForm = useCallback(() => {
    form.reset({
      projectName: defaultProjectValues.projectName,
      host: defaultProjectValues.host,
      image: null,
    });
  }, [form, defaultProjectValues.projectName, defaultProjectValues.host]);

  return {
    form,
    resetForm,
  };
};
