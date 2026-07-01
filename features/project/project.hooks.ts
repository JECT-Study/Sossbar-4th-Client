'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useMyProfile } from '@/features/profile';
import { ApiError } from '@/shared/lib/api';

import type { ProjectCardItem, ProjectPayload, ProjectRequest } from './project.types';
import type { z } from 'zod';

import {
  confirmProjectMembers,
  createProject,
  deleteProject,
  deleteProjectMember,
  fetchProject,
  fetchProjects,
  fetchUserProjects,
  inviteProjectMember,
  projectKeys,
  updateProject,
} from './project.api';
import { buildProjectInviteUrl, invalidateProjectListQueries, mapMyProjectsToCardItems } from './project.lib';
import { CreateProjectFormSchema, ProjectDetailInfoFormSchema, UpdateProjectFormSchema } from './project.schemas';

export const useProjects = (enabled = true) =>
  useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
    enabled,
  });

export const useProject = (projectId: number, enabled = true, options?: { throwOnError?: boolean }) =>
  useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => fetchProject(projectId),
    enabled: enabled && projectId > 0,
    ...options,
  });

export const useUserProjects = (userId: number) =>
  useQuery({
    queryKey: projectKeys.byUser(userId),
    queryFn: () => fetchUserProjects(userId),
    enabled: userId > 0,
  });

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),
    onSuccess: (_data, projectId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, profile?.userId);
    },
  });
};

export const useInviteProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: () => inviteProjectMember(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, profile?.userId);
    },
  });
};

export const useDeleteProjectMember = (projectId: number) => {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();

  return useMutation({
    mutationFn: (userId: number) => deleteProjectMember(projectId, userId),
    onSuccess: (_data, removedUserId) => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      invalidateProjectListQueries(queryClient, profile?.userId);
      if (removedUserId > 0) {
        void queryClient.invalidateQueries({ queryKey: projectKeys.byUser(removedUserId) });
      }
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
      invalidateProjectListQueries(queryClient, profile?.userId);
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
      invalidateProjectListQueries(queryClient, profile?.userId);
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
      invalidateProjectListQueries(queryClient, profile?.userId);
    },
  });
};

export type CreateProjectFormInput = z.input<typeof CreateProjectFormSchema>;
export type CreateProjectFormValues = z.output<typeof CreateProjectFormSchema>;

const CREATE_PROJECT_DEFAULT_VALUES: CreateProjectFormInput = {
  projectName: '',
  host: '',
  image: null,
};

export const useCreateProjectForm = () => {
  const form = useForm<CreateProjectFormInput, unknown, CreateProjectFormValues>({
    defaultValues: CREATE_PROJECT_DEFAULT_VALUES,
    mode: 'onChange',
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

export type UpdateProjectFormValues = z.infer<typeof UpdateProjectFormSchema>;

interface UpdateProjectFormParams {
  defaultProjectValues: ProjectRequest;
}

export const useUpdateProjectForm = ({ defaultProjectValues }: UpdateProjectFormParams) => {
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

interface CreateProjectModalParams {
  onOpenChange: (open: boolean) => void;
}

export const useCreateProjectModal = ({ onOpenChange }: CreateProjectModalParams) => {
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null);
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
    () => (createdProjectId !== null ? buildProjectInviteUrl(createdProjectId, myProfile?.username) : ''),
    [createdProjectId, myProfile?.username],
  );

  const resetAll = useCallback(() => {
    resetForm();
    setCreatedProjectId(null);
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
      const createdProject = await createProjectMutation({
        request: {
          projectName: data.projectName.trim(),
          host: data.host.trim(),
        },
        image: data.image,
      });

      setCreatedProjectId(createdProject.projectId);
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof ApiError ? error.message : '프로젝트 생성 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
      });
    }
  };

  return {
    createdProjectId,
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
    try {
      form.clearErrors('root');
      await updateProjectMutation({
        request: {
          projectName: data.projectName.trim(),
          host: data.host.trim(),
        },
        image: data.image,
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

type UseProjectCardsResult = {
  projects: ProjectCardItem[];
  hasSession: boolean;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  refetch: ReturnType<typeof useProjects>['refetch'];
};

export type ProjectDetailInfoFormValues = z.infer<typeof ProjectDetailInfoFormSchema>;

interface UseProjectDetailInfoFormParams {
  projectId: number;
  defaultValues: ProjectDetailInfoFormValues;
}

export const useProjectDetailInfoForm = ({ projectId, defaultValues }: UseProjectDetailInfoFormParams) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<ProjectDetailInfoFormValues>({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(ProjectDetailInfoFormSchema),
  });
  const { mutateAsync: updateProjectMutation, isPending: isSaving } = useUpdateProject(projectId);

  const startEditing = useCallback(() => {
    form.reset(defaultValues);
    setIsEditing(true);
  }, [form, defaultValues]);

  const cancelEditing = useCallback(() => {
    form.reset(defaultValues);
    setIsEditing(false);
  }, [form, defaultValues]);

  const onSubmit = useCallback(
    async (values: ProjectDetailInfoFormValues) => {
      try {
        form.clearErrors('root');
        await updateProjectMutation({
          request: {
            projectName: values.projectName.trim(),
            host: values.host.trim(),
            startDate: values.startDate,
            endDate: values.endDate,
            projectUrl: values.projectUrl,
            projectUrlType: values.projectUrlType,
          },
          image: values.image instanceof File ? values.image : null,
        });
        setIsEditing(false);
      } catch (error) {
        form.setError('root', {
          message:
            error instanceof ApiError
              ? error.message
              : '프로젝트 수정 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
        });
      }
    },
    [form, updateProjectMutation],
  );

  return { form, isSaving, isEditing, startEditing, cancelEditing, onSubmit };
};

interface UseProjectMembersEditParams {
  projectId: number;
}

export const useProjectMembersEdit = ({ projectId }: UseProjectMembersEditParams) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingRemovalIds, setPendingRemovalIds] = useState<Set<number>>(new Set());
  const { mutateAsync: removeMember, isPending: isSaving } = useDeleteProjectMember(projectId);

  const startEditing = useCallback(() => {
    setPendingRemovalIds(new Set());
    setIsEditing(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setPendingRemovalIds(new Set());
    setIsEditing(false);
  }, []);

  const toggleRemoval = useCallback((userId: number) => {
    setPendingRemovalIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }, []);

  const submit = useCallback(async () => {
    for (const userId of pendingRemovalIds) {
      await removeMember(userId);
    }
    setPendingRemovalIds(new Set());
    setIsEditing(false);
  }, [pendingRemovalIds, removeMember]);

  return { isEditing, startEditing, cancelEditing, pendingRemovalIds, toggleRemoval, isSaving, submit };
};

export const useProjectCards = (): UseProjectCardsResult => {
  const { data: profile } = useMyProfile();
  const hasSession = profile != null;
  const query = useProjects(hasSession);

  const projects = useMemo(() => {
    if (!query.data || !profile) {
      return [];
    }
    return mapMyProjectsToCardItems(query.data, { userId: profile.userId, nickname: profile.username ?? '' });
  }, [query.data, profile]);

  return {
    projects,
    hasSession,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
