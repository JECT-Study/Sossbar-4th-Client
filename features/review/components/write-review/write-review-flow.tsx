'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { Button } from '@/shared/components/button';
import { StepIndicator } from '@/shared/components/step-indicator';

import type { ReviewStepId } from '../../review.constants';

import { ReviewStepFeedback } from './review-step-feedback';
import { ReviewStepSpectrum } from './review-step-spectrum';
import { ReviewStepTag } from './review-step-tag';
import {
  REVIEW_FEEDBACK_MIN_LENGTH,
  REVIEW_MAX_TAGS,
  REVIEW_STEPS,
  REVIEW_STEP_DESCRIPTIONS,
} from '../../review.constants';
import { useReviewFormData } from '../../review.hooks';

const STEP_ORDER: readonly ReviewStepId[] = REVIEW_STEPS.map((step) => step.id);

export const WriteReviewFlow = () => {
  const router = useRouter();
  const { data: formData, isPending, isError, refetch } = useReviewFormData();

  const [currentStep, setCurrentStep] = useState<ReviewStepId>('tag');
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(() => new Set());
  const [spectrumSteps, setSpectrumSteps] = useState<Record<number, number>>({});
  const [touchedSpectrums, setTouchedSpectrums] = useState<Set<number>>(() => new Set());
  const [feedback, setFeedback] = useState('');

  const goNext = useCallback(() => {
    setCurrentStep((step) => {
      const index = STEP_ORDER.indexOf(step);
      return STEP_ORDER[index + 1] ?? step;
    });
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

  const changeSpectrum = useCallback((spectrumId: number, step: number) => {
    setSpectrumSteps((prev) => ({ ...prev, [spectrumId]: step }));
    setTouchedSpectrums((prev) => {
      if (prev.has(spectrumId)) {
        return prev;
      }
      const next = new Set(prev);
      next.add(spectrumId);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    // TODO(제출 연동): projectId·revieweeId·직군 파라미터 확정 후 useCreateReview 연결
  }, []);

  const toggleTag = useCallback((tagId: number) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
        return next;
      }
      if (next.size >= REVIEW_MAX_TAGS) {
        return prev;
      }
      next.add(tagId);
      return next;
    });
  }, []);

  return (
    <div className="flex w-full max-w-[480px] flex-col items-center">
      <h1 className="text-heading-lg text-text-basic text-center font-bold">후기 작성</h1>
      <h2 className="text-body-base text-text-subtle mt-2 mb-6 font-medium">{REVIEW_STEP_DESCRIPTIONS[currentStep]}</h2>
      <StepIndicator steps={REVIEW_STEPS} current={currentStep} aria-label="후기 작성 단계" />

      {isPending ? (
        <p className="text-body-base text-text-subtle mt-13">불러오는 중…</p>
      ) : isError || !formData ? (
        <div className="mt-13 flex flex-col items-center gap-4">
          <p className="text-body-base text-text-basic">폼 데이터를 불러오지 못했습니다.</p>
          <Button type="button" variant="secondary" size="medium" onClick={() => void refetch()}>
            다시 시도
          </Button>
        </div>
      ) : currentStep === 'tag' ? (
        <ReviewStepTag
          tags={formData.tags}
          selectedTagIds={selectedTagIds}
          onToggleTag={toggleTag}
          onPrev={goPrev}
          onNext={goNext}
        />
      ) : currentStep === 'spectrum' ? (
        <ReviewStepSpectrum
          spectrums={formData.spectrums}
          spectrumSteps={spectrumSteps}
          onSpectrumChange={changeSpectrum}
          canGoNext={formData.spectrums.every((spectrum) => touchedSpectrums.has(spectrum.spectrumId))}
          onPrev={goPrev}
          onNext={goNext}
        />
      ) : (
        <ReviewStepFeedback
          feedback={feedback}
          onFeedbackChange={setFeedback}
          canSubmit={feedback.trim().length >= REVIEW_FEEDBACK_MIN_LENGTH}
          onPrev={goPrev}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
