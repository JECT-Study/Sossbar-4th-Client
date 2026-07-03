import { z } from 'zod';

import {
  REVIEW_FEEDBACK_MAX_LENGTH,
  REVIEW_FEEDBACK_MIN_LENGTH,
  REVIEW_MAX_TAGS,
  REVIEW_DEFAULT_SPECTRUM_STEP,
  REVIEW_SPECTRUM_STEP_COUNT,
} from './review.constants';

export const ReviewFeedbackSchema = z
  .string()
  .trim()
  .min(REVIEW_FEEDBACK_MIN_LENGTH, { message: `후기는 ${REVIEW_FEEDBACK_MIN_LENGTH}자 이상 입력해 주세요.` })
  .max(REVIEW_FEEDBACK_MAX_LENGTH, { message: `후기는 ${REVIEW_FEEDBACK_MAX_LENGTH}자 이하로 입력해 주세요.` });

export const ReviewSpectrumAnswerSchema = z.object({
  spectrumId: z.number(),
  step: z
    .number()
    .int()
    .min(0)
    .max(REVIEW_SPECTRUM_STEP_COUNT - 1)
    .refine((step) => step !== REVIEW_DEFAULT_SPECTRUM_STEP),
});

export const ReviewTagIdsSchema = z
  .array(z.number())
  .min(1, { message: '태그를 1개 이상 선택해 주세요.' })
  .max(REVIEW_MAX_TAGS, { message: `태그는 최대 ${REVIEW_MAX_TAGS}개까지 선택할 수 있어요.` });

export const ReviewSpectrumsSchema = z.array(ReviewSpectrumAnswerSchema);

export const ReviewWriteFormSchema = z.object({
  tagIds: ReviewTagIdsSchema,
  spectrums: ReviewSpectrumsSchema,
  feedback: ReviewFeedbackSchema,
});
