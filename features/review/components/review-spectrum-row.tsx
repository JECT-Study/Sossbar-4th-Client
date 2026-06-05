'use client';

import { Fragment } from 'react';

import { ProgressStepper } from '@/shared/components/stepper';

const STEP_COUNT = 6;

interface Props {
  spectrumId: number;
  leftLabel: string;
  rightLabel: string;
  valueStep: number;
  onChange: (spectrumId: number, step: number) => void;
}

export const ReviewSpectrumRow = ({ spectrumId, leftLabel, rightLabel, valueStep, onChange }: Props) => {
  return (
    <Fragment>
      <span className="text-detail-xs text-text-subtle min-w-0 shrink-0 text-left leading-normal font-medium whitespace-nowrap">
        {leftLabel}
      </span>
      <div className="flex min-h-[18px] min-w-0 justify-center">
        <ProgressStepper
          stepCount={STEP_COUNT}
          value={valueStep}
          onChangeAction={(nextIndex) => {
            onChange(spectrumId, nextIndex);
          }}
          aria-label={`${leftLabel}에서 ${rightLabel} 사이 성향`}
          className="w-full max-w-[515px]"
        />
      </div>
      <span className="text-detail-xs text-text-subtle min-w-0 shrink-0 text-left leading-normal font-medium whitespace-nowrap">
        {rightLabel}
      </span>
    </Fragment>
  );
};

// step 0–5 → backend strength 1–6
export const spectrumStepToValue = (step: number): number => step + 1;
