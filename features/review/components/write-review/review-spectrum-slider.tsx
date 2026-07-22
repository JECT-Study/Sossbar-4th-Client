'use client';

import { cn } from '@/shared/lib/cn';

import { REVIEW_DEFAULT_SPECTRUM_STEP, REVIEW_SPECTRUM_STEP_COUNT } from '../../review.constants';

const MAX_STEP_INDEX = REVIEW_SPECTRUM_STEP_COUNT - 1;
const CENTER_STEP = REVIEW_DEFAULT_SPECTRUM_STEP;
const LEFT_TRACK_CLASS = 'bg-gradient-to-r from-primary-500 to-graphic-skyblue-subtler';
const RIGHT_TRACK_CLASS = 'bg-gradient-to-r from-graphic-yellow to-tertiary-500';
const TRACK_SEGMENT_KEYS = ['left-3', 'left-2', 'left-1', 'right-1', 'right-2', 'right-3'] as const;

interface Props {
  leftLabel: string;
  rightLabel: string;
  /** 0 ~ MAX_STEP_INDEX. CENTER_STEP is only used before the user selects a value. */
  value: number;
  onChange: (step: number) => void;
}

const clampStep = (step: number) => Math.min(MAX_STEP_INDEX, Math.max(0, step));

const skipCenterStep = (step: number, direction: -1 | 1) => {
  if (step !== CENTER_STEP) {
    return step;
  }
  return CENTER_STEP + direction;
};

const toSelectableStep = (step: number, direction: -1 | 1) => clampStep(skipCenterStep(clampStep(step), direction));

const stepFromPointer = (element: HTMLElement, clientX: number) => {
  const rect = element.getBoundingClientRect();
  const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
  const clampedRatio = Math.min(1, Math.max(0, ratio));
  const step = Math.round(clampedRatio * MAX_STEP_INDEX);
  return toSelectableStep(step, clampedRatio < 0.5 ? -1 : 1);
};

export const ReviewSpectrumSlider = ({ leftLabel, rightLabel, value, onChange }: Props) => {
  const percent = (value / MAX_STEP_INDEX) * 100;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const next = stepFromPointer(event.currentTarget, event.clientX);
    onChange(next);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }
    const next = stepFromPointer(event.currentTarget, event.clientX);
    if (next !== value) {
      onChange(next);
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next = value;
    let direction: -1 | 1 = 1;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        next = value - 1;
        direction = -1;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        next = value + 1;
        direction = 1;
        break;
      case 'Home':
        next = 0;
        direction = -1;
        break;
      case 'End':
        next = MAX_STEP_INDEX;
        direction = 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const clamped = toSelectableStep(next, direction);
    if (clamped !== value) {
      onChange(clamped);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between gap-2">
        <span className="text-detail-xs text-text-subtle shrink-0 font-medium">{leftLabel}</span>
        <span className="text-detail-xs text-text-subtle shrink-0 font-medium">{rightLabel}</span>
      </div>

      <div
        role="slider"
        tabIndex={0}
        aria-label={`${leftLabel}에서 ${rightLabel} 사이 성향`}
        aria-valuemin={1}
        aria-valuemax={MAX_STEP_INDEX}
        aria-valuenow={value < CENTER_STEP ? value + 1 : value}
        className="relative flex h-7 w-full cursor-pointer touch-none items-center outline-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <div className="relative h-2 w-full overflow-hidden rounded-[2px]">
          <div aria-hidden className={cn('absolute inset-y-0 left-0 w-1/2', LEFT_TRACK_CLASS)} />
          <div aria-hidden className={cn('absolute inset-y-0 right-0 w-1/2', RIGHT_TRACK_CLASS)} />
          <div aria-hidden className="absolute inset-0 grid grid-cols-6">
            {TRACK_SEGMENT_KEYS.map((key, index) => (
              <span key={key} className={cn(index < MAX_STEP_INDEX - 1 && 'border-input-surface border-r-[0.5px]')} />
            ))}
          </div>
        </div>
        <span
          aria-hidden
          className="bg-input-surface absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0px_4px_16px_rgba(96,96,96,0.3)] transition-[left] duration-75 lg:size-5"
          style={{ left: `${percent}%` }}
        />
      </div>
    </div>
  );
};
