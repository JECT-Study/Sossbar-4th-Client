'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useMyProfile } from '@/features/profile';
import { projectKeys, useProject } from '@/features/project';

import type { ReviewStepId } from './review.constants';
import type { ReviewWriteFormData } from './review.types';

import { createReview, fetchProjectReviews, fetchReviewFormData, fetchReviews, reviewKeys } from './review.api';
import { REVIEW_STEPS } from './review.constants';
import { spectrumStepToValue } from './review.lib';
import { ReviewWriteFormSchema } from './review.schemas';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
};

export const useUserReviews = (userLink: string) =>
  useSuspenseQuery({
    queryKey: reviewKeys.reviews(userLink),
    queryFn: () => fetchReviews(userLink),
  });

export const useReviewFormData = () =>
  useQuery({
    queryKey: reviewKeys.formData(),
    queryFn: fetchReviewFormData,
  });

export const useProjectReviews = (userLink: string, projectId: number) =>
  useQuery({
    queryKey: reviewKeys.projectReviews(userLink, projectId),
    queryFn: () => fetchProjectReviews(userLink, projectId),
    enabled: userLink.length > 0 && projectId > 0,
    throwOnError: false,
  });

const STEP_ORDER: readonly ReviewStepId[] = REVIEW_STEPS.map((step) => step.id);

interface UseWriteReviewFlowParams {
  projectId: number;
  revieweeId: number;
}

const reviewWriteFormDefaultValues: ReviewWriteFormData = {
  tagIds: [],
  spectrums: [],
  feedback: '',
};

export const useWriteReviewForm = () =>
  useForm<ReviewWriteFormData>({
    defaultValues: reviewWriteFormDefaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(ReviewWriteFormSchema),
  });

/** 다단계 후기 작성 플로우의 단계 이동·선택 상태·제출 로직을 캡슐화한다. */
export const useWriteReviewFlow = ({ projectId, revieweeId }: UseWriteReviewFlowParams) => {
  const router = useRouter();
  const form = useWriteReviewForm();
  const { data: formData, isPending, isError, refetch } = useReviewFormData();
  const { data: profile } = useMyProfile();
  const { data: projectData } = useProject(projectId, true, { throwOnError: false });
  const { mutateAsync: submitReview, isPending: isSubmitting } = useCreateReview();

  const [currentStep, setCurrentStep] = useState<ReviewStepId>('tag');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 프로젝트 내 다른 멤버가 이미 후기를 남겼다면 스펙트럼은 한 번만 집계하므로 제출에서 제외한다.
  const hasSubmittedAnyReview = useMemo(() => {
    if (!projectData || !profile) {
      return false;
    }
    return projectData.members.some((member) => member.userId !== profile.userId && member.reviewWritten === true);
  }, [projectData, profile]);

  const goNext = useCallback(() => {
    setCurrentStep((step) => STEP_ORDER[STEP_ORDER.indexOf(step) + 1] ?? step);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep((step) => {
      const index = STEP_ORDER.indexOf(step);
      if (index <= 0) {
        router.back();
        return step;
      }
      return STEP_ORDER[index - 1];
    });
  }, [router]);

  const handleSubmit = useCallback(async () => {
    const isValid = await form.trigger();
    if (!formData || !isValid) {
      return;
    }
    const { feedback, tagIds, spectrums: formSpectrums } = form.getValues();
    const hasAllSpectrumAnswers =
      hasSubmittedAnyReview ||
      formData.spectrums.every((spectrum) => formSpectrums.some((answer) => answer.spectrumId === spectrum.spectrumId));
    if (tagIds.length === 0 || !hasAllSpectrumAnswers) {
      return;
    }
    setSubmitError(null);
    const spectrums = hasSubmittedAnyReview
      ? []
      : formData.spectrums.map((spectrum) => {
          const answer = formSpectrums.find((item) => item.spectrumId === spectrum.spectrumId);
          return {
            spectrumId: spectrum.spectrumId,
            value: answer ? spectrumStepToValue(answer.step) : 1,
          };
        });
    try {
      await submitReview({
        projectId,
        revieweeId,
        feedback: feedback.trim(),
        tagIds,
        spectrums,
      });
      setSubmitDialogOpen(false);
      router.push(`/projects/${projectId}?reviewSubmitted=1`);
    } catch {
      setSubmitError('제출에 실패했습니다. 다시 시도해주세요.');
    }
  }, [form, formData, hasSubmittedAnyReview, submitReview, projectId, revieweeId, router]);

  const openSubmitDialog = useCallback(() => setSubmitDialogOpen(true), []);

  const changeSubmitDialogOpen = useCallback((open: boolean) => {
    setSubmitDialogOpen(open);
    if (!open) {
      setSubmitError(null);
    }
  }, []);

  return {
    form,
    formData,
    isPending,
    isError,
    refetch,
    currentStep,
    goNext,
    goPrev,
    isSubmitting,
    submitDialogOpen,
    submitError,
    openSubmitDialog,
    changeSubmitDialogOpen,
    handleSubmit,
  };
};
