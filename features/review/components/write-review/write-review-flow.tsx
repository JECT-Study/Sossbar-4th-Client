'use client';

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

  const displayName = revieweeName.trim() || '동료';

  return (
    <div className="flex w-full max-w-[480px] flex-col items-center">
      <h1 className="text-heading-lg text-text-basic text-center font-bold">후기 작성</h1>
      <h2 className="text-body-base text-text-subtle mt-2 mb-6 font-medium">
        {
          {
            tag: `${displayName}님을 잘 나타내는 태그를 선택해주세요.`,
            spectrum: `${displayName}님의 업무 성향 스펙트럼을 선택해주세요.`,
            feedback: `${displayName}님에 대한 솔직한 후기를 남겨주세요.`,
          }[currentStep]
        }
      </h2>
      <StepIndicator steps={REVIEW_STEPS} current={currentStep} aria-label="후기 작성 단계" />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(() => {
            openSubmitDialog();
          })}
          className="w-full"
          noValidate
        >
          {isPending ? (
            <p className="text-body-base text-text-subtle mt-13">불러오는 중...</p>
          ) : isError || !formData ? (
            <div className="mt-13 flex flex-col items-center gap-4">
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
