'use client';

import { Button } from '@/shared/components/button';
import { Textarea } from '@/shared/components/textarea';

import { REVIEW_FEEDBACK_MAX_LENGTH, REVIEW_FEEDBACK_MIN_LENGTH, REVIEW_FEEDBACK_TIPS } from '../../review.constants';

interface Props {
  feedback: string;
  onFeedbackChange: (value: string) => void;
  canSubmit: boolean;
  isSubmitting?: boolean;
  onPrev: () => void;
  onSubmit: () => void;
}

export const ReviewStepFeedback = ({
  feedback,
  onFeedbackChange,
  canSubmit,
  isSubmitting = false,
  onPrev,
  onSubmit,
}: Props) => {
  const showError = feedback.length > 0 && feedback.trim().length < REVIEW_FEEDBACK_MIN_LENGTH;

  return (
    <div className="mt-13 flex w-full max-w-[480px] flex-col">
      <h3 className="text-heading-sm text-text-basic font-bold">후기 작성</h3>
      <p className="text-body-sm text-text-subtle mt-2">(필수) 최소 {REVIEW_FEEDBACK_MIN_LENGTH}자이상 작성해주세요.</p>

      <Textarea
        name="feedback"
        className="min-h-[168px]"
        wrapperClassName="mt-3"
        placeholder="ex) 적극적이고 배려심이 깊다."
        value={feedback}
        maxLength={REVIEW_FEEDBACK_MAX_LENGTH}
        error={showError}
        helperText={showError ? `후기는 ${REVIEW_FEEDBACK_MIN_LENGTH}자 이상 입력해 주세요.` : undefined}
        onChange={(event) => onFeedbackChange(event.target.value)}
      />

      <div className="bg-surface-gray-subtler mt-6 rounded-lg px-4 py-4">
        <p className="text-body-sm text-text-basic font-medium">💡 이런 내용으로 후기를 작성해보세요.</p>
        <ul className="mt-3 flex flex-col gap-2">
          {REVIEW_FEEDBACK_TIPS.map((tip) => (
            <li key={tip.text} className="flex gap-1.5">
              <span aria-hidden className="text-text-subtle">
                •
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-body-sm text-text-subtle">{tip.text}</span>
                <span className="text-body-sm text-text-subtler">예) {tip.example}</span>
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
        <Button type="button" size="medium" onClick={onSubmit} disabled={!canSubmit || isSubmitting} className="w-full">
          후기 제출
        </Button>
      </div>
    </div>
  );
};
