'use client';

import { Fragment } from 'react';

import { cn } from '@/shared/lib/cn';

import { REVIEW_SPECTRUM_STEP_COUNT } from '../../review.constants';

const MAX_STEP_INDEX = REVIEW_SPECTRUM_STEP_COUNT - 1;

/** 프로필 스펙트럼과 동일한 좌·우 트랙 그라데이션 (skyblue→primary / tertiary→yellow) */
const LEFT_TRACK_CLASS = 'bg-gradient-to-r from-graphic-skyblue-subtler to-primary-500';
const RIGHT_TRACK_CLASS = 'bg-gradient-to-r from-tertiary-500 to-yellow-500';

interface Props {
  leftLabel: string;
  rightLabel: string;
  /** 0 ~ MAX_STEP_INDEX */
  value: number;
  onChange: (step: number) => void;
}

const clampStep = (step: number) => Math.min(MAX_STEP_INDEX, Math.max(0, step));

const stepFromPointer = (element: HTMLElement, clientX: number) => {
  const rect = element.getBoundingClientRect();
  const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
  return clampStep(Math.round(Math.min(1, Math.max(0, ratio)) * MAX_STEP_INDEX));
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
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        next = value - 1;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        next = value + 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = MAX_STEP_INDEX;
        break;
      default:
        return;
    }
    event.preventDefault();
    const clamped = clampStep(next);
    if (clamped !== value) {
      onChange(clamped);
    }
  };

  return (
    <Fragment>
      <span className="text-detail-sm text-text-subtle shrink-0 font-medium whitespace-nowrap">{leftLabel}</span>

      <div
        role="slider"
        tabIndex={0}
        aria-label={`${leftLabel}에서 ${rightLabel} 사이 성향`}
        aria-valuemin={1}
        aria-valuemax={REVIEW_SPECTRUM_STEP_COUNT}
        aria-valuenow={value + 1}
        className="relative flex h-5 w-full cursor-pointer touch-none items-center outline-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <div className="relative h-2 w-full">
          <div
            aria-hidden
            className={cn('absolute inset-y-0 left-0 rounded-l-full', LEFT_TRACK_CLASS)}
            style={{ width: `${percent}%` }}
          />
          <div
            aria-hidden
            className={cn('absolute inset-y-0 right-0 rounded-r-full', RIGHT_TRACK_CLASS)}
            style={{ left: `${percent}%` }}
          />
        </div>
        <span
          aria-hidden
          className="border-border-gray-light absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-[left] duration-75"
          style={{ left: `${percent}%` }}
        />
      </div>

      <span className="text-detail-sm text-text-subtle shrink-0 font-medium whitespace-nowrap">{rightLabel}</span>
    </Fragment>
  );
};
