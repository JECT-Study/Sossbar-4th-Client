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
    <div className="mt-4 flex w-full max-w-[480px] flex-col gap-10 pb-10">
      <div className="flex w-full flex-col gap-2">
        <h3 className="text-heading-sm text-text-basic font-bold">후기 작성</h3>
        <p className="text-body-sm text-text-subtle">(필수) 최소 {REVIEW_FEEDBACK_MIN_LENGTH}자이상 작성해주세요.</p>

        <Controller
          control={control}
          name="feedback"
          render={({ field }) => (
            <Textarea
              name={field.name}
              className="border-input-border text-body-sm placeholder:text-text-subtler min-h-[152px] px-3 py-2"
              wrapperClassName="mt-0"
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
      </div>

      <div className="bg-bg-gray-subtler flex w-full flex-col gap-2 rounded-md px-4 py-6">
        <div className="flex items-center gap-0.5">
          <span aria-hidden className="text-body-base leading-none">
            💡
          </span>
          <p className="text-body-base text-text-basic font-bold">이런 내용으로 후기를 작성해보세요.</p>
        </div>
        <ul className="flex flex-col pl-5">
          {REVIEW_FEEDBACK_TIPS.map((tip) => (
            <li key={tip.text} className="relative">
              <span aria-hidden className="text-body-sm text-text-subtle absolute top-0 -left-5">
                •
              </span>
              <p className="text-body-sm text-text-subtle leading-normal">
                {tip.text}
                <br />
                {tip.examplePrefix}
                {tip.example}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full gap-4">
        <Button
          type="button"
          variant="tertiary"
          size="large"
          onClick={onPrev}
          className="border-border-gray-light h-14 min-h-12 w-full self-stretch rounded-md border"
        >
          뒤로가기
        </Button>
        <Button
          type="submit"
          size="large"
          disabled={!canSubmit || isSubmitting}
          className="h-14 min-h-12 w-full self-stretch rounded-md"
        >
          후기제출
        </Button>
      </div>
    </div>
  );
};
