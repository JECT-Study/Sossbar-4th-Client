'use client';

import { useState } from 'react';

import { cn } from '@/shared/lib/cn';

type StepVariant = 'default' | 'active' | 'active-yellow';

type StepIndicatorProps = {
  variant?: StepVariant;
  className?: string;
};

const stepIndicatorStyles: Record<StepVariant, string> = {
  default: 'bg-(--color-element-disabled-dark) border-(--color-element-disabled-light)',
  active: 'bg-(--color-element-primary) border-border-primary-light',
  'active-yellow': 'bg-(--color-graphic-yellow) border-(--color-graphic-yellow-subtler)',
};

export const StepIndicator = ({ variant = 'default', className }: StepIndicatorProps) => {
  return (
    <span
      className={cn('block h-[18px] w-[18px] shrink-0 rounded-full border-2', stepIndicatorStyles[variant], className)}
    />
  );
};

const STEP_COUNT = 6;
const YELLOW_STEP_START = 3;

export const ProgressStepper = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const getVariant = (index: number): StepVariant => {
    if (selectedIndex !== index) {
      return 'default';
    }
    return index < YELLOW_STEP_START ? 'active' : 'active-yellow';
  };

  const stepIndices = Array.from({ length: STEP_COUNT }, (_, i) => i);

  return (
    <div className="relative flex h-[18px] w-[515px] items-center justify-between">
      {/* inset-x-[9px]: dot 중앙 기준 연결, top-[8px]: (18 - 2) / 2 = 수직 중앙 */}
      <div className="absolute inset-x-[9px] top-[8px] h-0.5 bg-(--color-element-disabled-light)" />
      {stepIndices.map((stepIndex) => (
        <button
          key={`step-${stepIndex}`}
          type="button"
          onClick={() => setSelectedIndex(stepIndex)}
          className="relative z-10 rounded-full p-0 leading-none outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-primary) focus-visible:ring-offset-1"
        >
          <StepIndicator variant={getVariant(stepIndex)} />
        </button>
      ))}
    </div>
  );
};
