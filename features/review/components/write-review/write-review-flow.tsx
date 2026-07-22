'use client';

import { useRouter } from 'next/navigation';
import { FormProvider } from 'react-hook-form';

import { Button } from '@/shared/components/button';
import { StepIndicator } from '@/shared/components/step-indicator';

import { ReviewSubmitDialog } from '../review-submit-dialog';
import { ReviewStepFeedback } from './review-step-feedback';
import { ReviewStepSpectrum } from './review-step-spectrum';
import { ReviewStepTag } from './review-step-tag';
import { REVIEW_STEPS } from '../../review.constants';
import { useWriteReviewFlow } from '../../review.hooks';

interface Props {
  projectId: number;
  revieweeId: number;
  revieweeName: string;
}

export const WriteReviewFlow = ({ projectId, revieweeId, revieweeName }: Props) => {
  const router = useRouter();
  const {
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
  } = useWriteReviewFlow({ projectId, revieweeId });

  const displayName = revieweeName.trim();

  if (displayName.length === 0) {
    return (
      <div className="flex min-h-[320px] w-full max-w-[480px] flex-col items-center justify-center gap-4 px-4">
        <p className="text-body-base text-text-basic text-center">후기 작성 대상 정보가 올바르지 않습니다.</p>
        <Button type="button" variant="secondary" size="medium" onClick={() => router.push('/projects')}>
          프로젝트 관리로 돌아가기
        </Button>
      </div>
    );
  }

  const stepDescription = {
    tag: (
      <>
        <span className="font-bold">{displayName}</span>님에 태그를 선택해주세요.
      </>
    ),
    spectrum: (
      <>
        <span className="font-bold">{displayName}</span>님에 소프트 스킬 스펙트럼을 선택해주세요.
      </>
    ),
    feedback: (
      <>
        <span className="font-bold">{displayName}</span>님에 대한 솔직한 후기를 남겨주세요.
      </>
    ),
  }[currentStep];

  return (
    <div className="flex w-full max-w-[480px] flex-col items-center">
      <div className="flex w-full flex-col items-center gap-3 pb-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-heading-lg text-text-basic text-center font-bold">후기 작성</h1>
          <p className="text-body-base text-text-subtle text-center font-medium">{stepDescription}</p>
        </div>
        <StepIndicator steps={REVIEW_STEPS} current={currentStep} aria-label="후기 작성 단계" />
      </div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(() => {
            openSubmitDialog();
          })}
          className="w-full"
          noValidate
        >
          {isPending ? (
            <p className="text-body-base text-text-subtle mt-4">불러오는 중...</p>
          ) : isError || !formData ? (
            <div className="mt-4 flex flex-col items-center gap-4">
              <p className="text-body-base text-text-basic">데이터를 불러오지 못했습니다.</p>
              <Button type="button" variant="secondary" size="medium" onClick={() => void refetch()}>
                다시 시도
              </Button>
            </div>
          ) : currentStep === 'tag' ? (
            <ReviewStepTag tags={formData.tags} onPrev={goPrev} onNext={goNext} />
          ) : currentStep === 'spectrum' ? (
            <ReviewStepSpectrum spectrums={formData.spectrums} onPrev={goPrev} onNext={goNext} />
          ) : (
            <ReviewStepFeedback isSubmitting={isSubmitting} onPrev={goPrev} />
          )}
        </form>
      </FormProvider>

      <ReviewSubmitDialog
        open={submitDialogOpen}
        onOpenChange={changeSubmitDialogOpen}
        isSubmitting={isSubmitting}
        errorMessage={submitError ?? undefined}
        onConfirm={handleSubmit}
      />
    </div>
  );
};
