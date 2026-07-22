'use client';

import { useFormContext, useWatch } from 'react-hook-form';

import { Button } from '@/shared/components/button';

import type { ReviewWriteFormData, Spectrum } from '../../review.types';

import { ReviewSpectrumSlider } from './review-spectrum-slider';
import { REVIEW_DEFAULT_SPECTRUM_STEP } from '../../review.constants';
import { ReviewSpectrumsSchema } from '../../review.schemas';

interface Props {
  spectrums: Spectrum[];
  onPrev: () => void;
  onNext: () => void;
}

export const ReviewStepSpectrum = ({ spectrums, onPrev, onNext }: Props) => {
  const { control, setValue } = useFormContext<ReviewWriteFormData>();
  const selectedSpectrums = useWatch({ control, name: 'spectrums' }) ?? [];
  const canGoNext =
    ReviewSpectrumsSchema.safeParse(selectedSpectrums).success &&
    spectrums.every((spectrum) => selectedSpectrums.some((answer) => answer.spectrumId === spectrum.spectrumId));

  const changeSpectrum = (spectrumId: number, step: number) => {
    const exists = selectedSpectrums.some((answer) => answer.spectrumId === spectrumId);
    const next = exists
      ? selectedSpectrums.map((answer) => (answer.spectrumId === spectrumId ? { spectrumId, step } : answer))
      : [...selectedSpectrums, { spectrumId, step }];

    setValue('spectrums', next, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <div className="mt-4 flex w-full max-w-[480px] flex-col">
      <h3 className="text-heading-sm text-text-basic font-bold">소프트 스킬 스펙트럼 성향</h3>

      <div className="mt-6 flex flex-col gap-4">
        {spectrums.map((spectrum) => {
          const answer = selectedSpectrums.find((item) => item.spectrumId === spectrum.spectrumId);

          return (
            <ReviewSpectrumSlider
              key={spectrum.spectrumId}
              leftLabel={spectrum.leftLabel}
              rightLabel={spectrum.rightLabel}
              value={answer?.step ?? REVIEW_DEFAULT_SPECTRUM_STEP}
              onChange={(step) => changeSpectrum(spectrum.spectrumId, step)}
            />
          );
        })}
      </div>

      <div className="mt-12 flex w-full gap-4">
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
          type="button"
          size="large"
          onClick={onNext}
          disabled={!canGoNext}
          className="h-14 min-h-12 w-full self-stretch rounded-md"
        >
          다음
        </Button>
      </div>
    </div>
  );
};
