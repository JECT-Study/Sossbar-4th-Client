'use client';

import { Button } from '@/shared/components/button';

import type { Spectrum } from '../../review.types';

import { ReviewSpectrumSlider } from './review-spectrum-slider';
import { REVIEW_DEFAULT_SPECTRUM_STEP } from '../../review.constants';

interface Props {
  spectrums: Spectrum[];
  spectrumSteps: Record<number, number>;
  onSpectrumChange: (spectrumId: number, step: number) => void;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const ReviewStepSpectrum = ({
  spectrums,
  spectrumSteps,
  onSpectrumChange,
  canGoNext,
  onPrev,
  onNext,
}: Props) => {
  return (
    <div className="mt-13 flex w-full max-w-[480px] flex-col">
      <h3 className="text-heading-sm text-text-basic font-bold">소프트 스킬 스펙트럼 성향</h3>

      <div className="mt-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-6">
        {spectrums.map((spectrum) => (
          <ReviewSpectrumSlider
            key={spectrum.spectrumId}
            leftLabel={spectrum.leftLabel}
            rightLabel={spectrum.rightLabel}
            value={spectrumSteps[spectrum.spectrumId] ?? REVIEW_DEFAULT_SPECTRUM_STEP}
            onChange={(step) => onSpectrumChange(spectrum.spectrumId, step)}
          />
        ))}
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
