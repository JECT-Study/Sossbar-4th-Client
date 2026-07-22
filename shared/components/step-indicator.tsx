import { CheckIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

export interface StepIndicatorStep {
  id: string | number;
  label: string;
}

interface Props {
  steps: readonly StepIndicatorStep[];
  /** `steps` 에 없는 id 를 넘기면 모든 단계가 비활성 상태로 렌더됩니다. */
  current: StepIndicatorStep['id'];
  'aria-label': string;
  className?: string;
}

export const StepIndicator = ({ steps, current, 'aria-label': ariaLabel, className }: Props) => {
  const currentIndex = steps.findIndex((step) => step.id === current);

  return (
    <ol className={cn('flex w-full items-center', className)} aria-label={ariaLabel}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index <= currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.id}
            className="flex min-w-0 flex-1 items-center last:flex-none"
            aria-current={step.id === current ? 'step' : undefined}
          >
            <div className="flex shrink-0 items-center gap-1.5">
              <span
                className={cn(
                  'text-detail-xs flex size-6 items-center justify-center rounded-full font-normal',
                  isActive ? 'bg-element-primary text-text-basic-inverse' : 'bg-bg-gray-subtler text-text-disabled',
                )}
              >
                {isCompleted ? <CheckIcon className="size-4" aria-hidden /> : index + 1}
              </span>
              <span
                className={cn(
                  'text-detail-sm shrink-0 font-medium whitespace-nowrap',
                  isActive ? 'text-text-basic' : 'text-text-subtler',
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast ? (
              <span
                className={cn(
                  'mx-2 h-px min-w-4 flex-1 lg:mx-4',
                  isCompleted ? 'bg-element-primary' : 'bg-element-disabled-light',
                )}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
};
