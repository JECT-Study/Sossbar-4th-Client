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
      aria-hidden
      className={cn('block h-[18px] w-[18px] shrink-0 rounded-full border-2', stepIndicatorStyles[variant], className)}
    />
  );
};

const DEFAULT_STEP_COUNT = 6;
const DEFAULT_YELLOW_STEP_START = 3;

export type ProgressStepperProps = {
  stepCount?: number;
  yellowStepStart?: number;
  value?: number | null;
  defaultValue?: number | null;
  onChangeAction?: (nextIndex: number) => void;
  className?: string;
  'aria-label'?: string;
};

export const ProgressStepper = ({
  stepCount = DEFAULT_STEP_COUNT,
  yellowStepStart = DEFAULT_YELLOW_STEP_START,
  value,
  defaultValue = null,
  onChangeAction,
  className,
  'aria-label': ariaLabel = '진행 단계',
}: ProgressStepperProps = {}) => {
  const [internalSelectedIndex, setInternalSelectedIndex] = useState<number | null>(defaultValue);
  const selectedIndex = value ?? internalSelectedIndex;
  const totalSteps = Math.max(stepCount, 0);

  const getVariant = (index: number): StepVariant => {
    if (selectedIndex !== index) {
      return 'default';
    }
    return index < yellowStepStart ? 'active' : 'active-yellow';
  };

  const stepIndices = Array.from({ length: totalSteps }, (_, i) => i);

  const handleStepClick = (stepIndex: number) => {
    if (value == null) {
      setInternalSelectedIndex(stepIndex);
    }
    onChangeAction?.(stepIndex);
  };

  if (totalSteps === 0) {
    return null;
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('relative flex h-[18px] w-full max-w-[515px] items-center justify-between', className)}
    >
      {/* inset-x-[9px]: dot 중앙 기준 연결, top-[8px]: (18 - 2) / 2 = 수직 중앙 */}
      <div className="absolute inset-x-[9px] top-[8px] h-0.5 bg-(--color-element-disabled-light)" />
      {stepIndices.map((stepIndex) => (
        <button
          key={`step-${stepIndex}`}
          type="button"
          onClick={() => handleStepClick(stepIndex)}
          aria-label={`${stepIndex + 1}/${totalSteps} 단계`}
          aria-current={selectedIndex === stepIndex ? 'step' : undefined}
          className="relative z-10 rounded-full p-0 leading-none outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-primary) focus-visible:ring-offset-1"
        >
          <StepIndicator variant={getVariant(stepIndex)} />
        </button>
      ))}
    </div>
  );
};
