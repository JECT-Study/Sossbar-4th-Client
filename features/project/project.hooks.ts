'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useMyProfile } from '@/features/profile';
import { trackEvent } from '@/shared/lib/analytics';
import { ApiError } from '@/shared/lib/api';

import type {
  FetchMyProjectsParams,
  ProjectCardItem,
  ProjectPayload,
  ProjectPositionValue,
  ProjectRequest,
} from './project.types';
import type { z } from 'zod';

import {
  confirmProjectMembers,
  createProject,
  deleteProject,
  deleteProjectMember,
  fetchProject,
  fetchProjects,
  fetchUserProject,
  fetchUserProjects,
  inviteProjectMember,
  projectKeys,
  updateProject,
} from './project.api';
import { DEFAULT_PROJECT_LIST_PARAMS } from './project.constants';
import {
  buildProjectInviteUrl,
  compressImage,
  invalidateProjectListQueries,
  mapMyProjectsToCardItems,
} from './project.lib';
import { CreateProjectFormSchema, UpdateProjectFormSchema } from './project.schemas';

/** 내 프로젝트 목록. 게스트 분기는 상위 Gate에서 처리되므로 항상 세션이 있다고 가정한다. */
export const useMyProjects = (params: FetchMyProjectsParams = DEFAULT_PROJECT_LIST_PARAMS) =>
  useSuspenseQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => fetchProjects(params),
  });

export const useProject = (projectId: number, enabled = true, options?: { throwOnError?: boolean }) =>
  useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => fetchProject(projectId),
    enabled: enabled && projectId > 0,
    ...options,
  });

export const useUserProjects = (userLink: string) =>
  useSuspenseQuery({
    queryKey: projectKeys.byUser(userLink),
    queryFn: () => fetchUserProjects(userLink),
  });

export const useUserProject = (userLink: string, projectId: number) =>
  useQuery({
    queryKey: projectKeys.byUserDetail(userLink, projectId),
    queryFn: () => fetchUserProject(userLink, projectId),
    enabled: Boolean(userLink) && projectId > 0,
  });

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),
    onSuccess: (_data, projectId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, profile?.userLink);
    },
  });
};

export const useInviteProjectMember = (projectLink: string) => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: (projectPositions: ProjectPositionValue[]) => inviteProjectMember(projectLink, projectPositions),
    onSuccess: () => {
      invalidateProjectListQueries(queryClient, profile?.userLink);
    },
  });
};

export const useDeleteProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: (userId: number) => deleteProjectMember(projectId, userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, profile?.userLink);
    },
  });
};

export const useConfirmProjectMembers = (projectId: number) => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: () => confirmProjectMembers(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, profile?.userLink);
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: (payload: ProjectPayload) => createProject(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(projectKeys.detail(data.projectId), data);
      invalidateProjectListQueries(queryClient, profile?.userLink);
    },
  });
};

export const useUpdateProject = (projectId: number) => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: (payload: ProjectPayload) => updateProject(projectId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(projectKeys.detail(data.projectId), data);
      invalidateProjectListQueries(queryClient, profile?.userLink);
    },
  });
};

export type CreateProjectFormInput = z.input<typeof CreateProjectFormSchema>;
export type CreateProjectFormValues = z.output<typeof CreateProjectFormSchema>;

const CREATE_PROJECT_DEFAULT_VALUES: CreateProjectFormInput = {
  projectName: '',
  host: '',
  projectPositions: [],
  startDate: null,
  endDate: null,
  image: null,
  projectUrl: '',
  projectUrlType: 'LINK',
};

const formatDateTimeForRequest = (date: Date | null | undefined, time: '00:00:00' | '23:59:59'): string => {
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}T${time}`;
};

const parseProjectFormDate = (value: string | null | undefined): Date | null => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const useCreateProjectForm = () => {
  const form = useForm<CreateProjectFormInput, unknown, CreateProjectFormValues>({
    defaultValues: CREATE_PROJECT_DEFAULT_VALUES,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(CreateProjectFormSchema),
  });

  const resetForm = useCallback(() => {
    form.reset(CREATE_PROJECT_DEFAULT_VALUES);
  }, [form]);

  return {
    form,
    resetForm,
  };
};

export type UpdateProjectFormInput = z.input<typeof UpdateProjectFormSchema>;
export type UpdateProjectFormValues = z.output<typeof UpdateProjectFormSchema>;

interface UpdateProjectFormParams {
  defaultProjectValues: ProjectRequest;
}

export const useUpdateProjectForm = ({ defaultProjectValues }: UpdateProjectFormParams) => {
  const defaultValues: UpdateProjectFormInput = useMemo(
    () => ({
      projectName: defaultProjectValues.projectName,
      host: defaultProjectValues.host,
      startDate: parseProjectFormDate(defaultProjectValues.startDate),
      endDate: parseProjectFormDate(defaultProjectValues.endDate),
      image: null,
      projectUrl: defaultProjectValues.projectUrl,
      projectUrlType: defaultProjectValues.projectUrlType,
    }),
    [defaultProjectValues],
  );

  const form = useForm<UpdateProjectFormInput, unknown, UpdateProjectFormValues>({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(UpdateProjectFormSchema),
  });

  const resetForm = useCallback(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return {
    form,
    resetForm,
  };
};

interface CreateProjectModalParams {
  onOpenChange: (open: boolean) => void;
}

export const useCreateProjectModal = ({ onOpenChange }: CreateProjectModalParams) => {
  const [createdProjectLink, setCreatedProjectLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: myProfile } = useMyProfile();
  const { mutateAsync: createProjectMutation, isPending: isSubmitting } = useCreateProject();
  const { form, resetForm } = useCreateProjectForm();

  const clearCopyResetTimer = useCallback(() => {
    if (copyResetTimerRef.current !== null) {
      clearTimeout(copyResetTimerRef.current);
      copyResetTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearCopyResetTimer;
  }, [clearCopyResetTimer]);

  const inviteUrl = useMemo(
    () => (createdProjectLink !== null ? buildProjectInviteUrl(createdProjectLink, myProfile?.username) : ''),
    [createdProjectLink, myProfile?.username],
  );

  const resetAll = useCallback(() => {
    resetForm();
    setCreatedProjectLink(null);
    setLinkCopied(false);
    clearCopyResetTimer();
  }, [clearCopyResetTimer, resetForm]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        resetAll();
      }
      onOpenChange(next);
    },
    [onOpenChange, resetAll],
  );

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(inviteUrl).then(() => {
      setLinkCopied(true);
      clearCopyResetTimer();
      copyResetTimerRef.current = setTimeout(() => {
        setLinkCopied(false);
        copyResetTimerRef.current = null;
      }, 3000);
    });
  };

  const onSubmit = async (data: CreateProjectFormValues) => {
    try {
      form.clearErrors('root');
      const image = data.image ? await compressImage(data.image) : null;
      const createdProject = await createProjectMutation({
        request: {
          projectName: data.projectName.trim(),
          host: data.host.trim(),
          projectPositions: data.projectPositions,
          startDate: formatDateTimeForRequest(data.startDate, '00:00:00'),
          endDate: formatDateTimeForRequest(data.endDate, '23:59:59'),
          projectUrl: data.projectUrl.trim(),
          projectUrlType: data.projectUrlType,
        },
        image,
      });

      setCreatedProjectLink(createdProject.projectLink);
      trackEvent('create_review_link');
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof ApiError ? error.message : '프로젝트 생성 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
      });
    }
  };

  return {
    createdProjectLink,
    form,
    handleCopyLink,
    handleOpenChange,
    inviteUrl,
    isSubmitting,
    linkCopied,
    onSubmit,
  };
};

interface UpdateProjectModalParams {
  projectId: number;
  defaultProjectValues: ProjectRequest;
  onOpenChange: (open: boolean) => void;
}

export const useUpdateProjectModal = ({ projectId, defaultProjectValues, onOpenChange }: UpdateProjectModalParams) => {
  const { mutateAsync: updateProjectMutation, isPending: isSubmitting } = useUpdateProject(projectId);
  const { form, resetForm } = useUpdateProjectForm({ defaultProjectValues });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        resetForm();
      }
      onOpenChange(next);
    },
    [onOpenChange, resetForm],
  );

  const onSubmit = async (data: UpdateProjectFormValues) => {
    const request: ProjectRequest = {
      projectName: data.projectName.trim(),
      host: data.host.trim(),
      startDate: formatDateTimeForRequest(data.startDate, '00:00:00'),
      endDate: formatDateTimeForRequest(data.endDate, '23:59:59'),
      projectUrl: data.projectUrl.trim(),
      projectUrlType: data.projectUrlType,
    };

    try {
      form.clearErrors('root');
      const image = data.image ? await compressImage(data.image) : null;
      await updateProjectMutation({
        request,
        image,
      });

      onOpenChange(false);
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof ApiError ? error.message : '프로젝트 수정 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
      });
    }
  };

  return {
    form,
    handleOpenChange,
    isSubmitting,
    onSubmit,
  };
};

/**
 * 내 프로젝트를 카드 아이템으로 변환해 반환한다.
 * 세션 판단(게스트 분기)은 상위 Gate가 담당하므로 여기서는 세션이 있다고 가정한다.
 */
export const useMyProjectCards = (params: FetchMyProjectsParams = DEFAULT_PROJECT_LIST_PARAMS): ProjectCardItem[] => {
  const { data: profile } = useMyProfile();
  const { data: projects } = useMyProjects(params);

  return useMemo(() => {
    if (!profile) {
      return [];
    }
    return mapMyProjectsToCardItems(projects, { userId: profile.userId, nickname: profile.username ?? '' });
  }, [projects, profile]);
};
