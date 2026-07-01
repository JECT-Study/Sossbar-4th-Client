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
    <div className="mt-13 flex w-full max-w-[480px] flex-col">
      <h3 className="text-heading-sm text-text-basic font-bold">업무 성향 스펙트럼 선택</h3>

      <div className="mt-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-6">
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

      <div className="mt-12 flex w-full gap-3">
        <Button
          type="button"
          variant="tertiary"
          size="medium"
          onClick={onPrev}
          className="border-border-gray-light w-full border"
        >
          뒤로가기
        </Button>
        <Button type="button" size="medium" onClick={onNext} disabled={!canGoNext} className="w-full">
          다음
        </Button>
      </div>
    </div>
  );
};
