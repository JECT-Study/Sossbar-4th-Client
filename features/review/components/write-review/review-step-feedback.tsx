'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Button } from '@/shared/components/button';
import { Textarea } from '@/shared/components/textarea';

import type { ReviewWriteFormData } from '../../review.types';

import { REVIEW_FEEDBACK_MAX_LENGTH, REVIEW_FEEDBACK_MIN_LENGTH, REVIEW_FEEDBACK_TIPS } from '../../review.constants';
import { ReviewFeedbackSchema } from '../../review.schemas';

interface Props {
  isSubmitting?: boolean;
  onPrev: () => void;
}

export const ReviewStepFeedback = ({ isSubmitting = false, onPrev }: Props) => {
  const { control, formState } = useFormContext<ReviewWriteFormData>();
  const feedback = useWatch({ control, name: 'feedback' });
  const canSubmit = ReviewFeedbackSchema.safeParse(feedback).success;
  const errorMessage = formState.errors.feedback?.message;

  return (
    <div className="mt-13 flex w-full max-w-[480px] flex-col">
      <h3 className="text-heading-sm text-text-basic font-bold">후기 작성</h3>
      <p className="text-body-sm text-text-subtle mt-2">
        (필수) 최소 {REVIEW_FEEDBACK_MIN_LENGTH}자 이상 작성해주세요.
      </p>

      <Controller
        control={control}
        name="feedback"
        render={({ field }) => (
          <Textarea
            name={field.name}
            className="min-h-[168px]"
            wrapperClassName="mt-3"
            placeholder="ex) 적극적이고 배려심이 깊다."
            value={field.value}
            maxLength={REVIEW_FEEDBACK_MAX_LENGTH}
            error={!!errorMessage}
            helperText={errorMessage}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      <div className="bg-surface-gray-subtler mt-6 rounded-lg px-4 py-4">
        <p className="text-body-sm text-text-basic font-medium">이런 내용으로 후기를 작성해보세요.</p>
        <ul className="mt-3 flex flex-col gap-2">
          {REVIEW_FEEDBACK_TIPS.map((tip) => (
            <li key={tip.text} className="flex gap-1.5">
              <span aria-hidden className="text-text-subtle">
                •
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-body-sm text-text-subtle">{tip.text}</span>
                <span className="text-body-sm text-text-subtler">예: {tip.example}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex w-full gap-3">
        <Button
          type="button"
          variant="tertiary"
          size="medium"
          onClick={onPrev}
          className="border-border-gray-light w-full border"
        >
          뒤로가기
        </Button>
        <Button type="submit" size="medium" disabled={!canSubmit || isSubmitting} className="w-full">
          후기 제출
        </Button>
      </div>
    </div>
  );
};
