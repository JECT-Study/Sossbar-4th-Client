'use client';

import { Dialog, RadioGroup } from 'radix-ui';
import { useId, useState } from 'react';

import { Button } from '@/shared/components/button';
import { Dropcomplete } from '@/shared/components/dropcomplete';
import { Textarea } from '@/shared/components/textarea';
import { cn } from '@/shared/lib/cn';

const REASON_OPTIONS = [
  { value: 'low-quality', label: '서비스 퀄리티가 낮아요' },
  { value: 'trust', label: '신뢰도가 떨어져요' },
  { value: 'alternative', label: '대체할 만한 서비스를 찾았어요' },
  { value: 'difficulty', label: '서비스 사용이 어려워요' },
  { value: 'burden', label: '부담감이 있어요' },
  { value: 'other', label: '기타' },
] as const;

export type WithdrawReasonValue = (typeof REASON_OPTIONS)[number]['value'];

export type WithdrawalSubmitPayload = {
  reason: WithdrawReasonValue;
  detail: string;
};

export type DropmodalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (payload: WithdrawalSubmitPayload) => void | Promise<void>;
  onConfirm?: () => void;
  defaultReason?: WithdrawReasonValue;
  className?: string;
};

const RadioRow = ({ value, label, checked }: { value: WithdrawReasonValue; label: string; checked: boolean }) => {
  const labelColorClass = checked ? 'text-text-basic' : 'text-text-subtle';

  return (
    <label className="flex cursor-pointer items-center gap-2" htmlFor={`withdraw-reason-${value}`}>
      <RadioGroup.Item
        value={value}
        id={`withdraw-reason-${value}`}
        className={cn(
          'focus-visible:ring-border-primary flex size-6 shrink-0 items-center justify-center rounded-2xl border border-solid outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          checked ? 'border-border-primary bg-bg-white' : 'border-border-gray bg-bg-white',
        )}
        aria-labelledby={`withdraw-reason-label-${value}`}
      >
        <RadioGroup.Indicator className="bg-element-primary flex size-4 items-center justify-center rounded-2xl" />
      </RadioGroup.Item>
      <span
        id={`withdraw-reason-label-${value}`}
        className={cn('text-body-base font-bold whitespace-nowrap', labelColorClass)}
      >
        {label}
      </span>
    </label>
  );
};

type WithdrawModalBodyProps = {
  headingId: string;
  descriptionId: string;
  defaultReason?: WithdrawReasonValue;
  onSubmit?: (payload: WithdrawalSubmitPayload) => void | Promise<void>;
  onClose: () => void;
  onWithdrawSubmitted: () => void;
};

const WithdrawModalBody = ({
  headingId,
  descriptionId,
  defaultReason,
  onSubmit,
  onClose,
  onWithdrawSubmitted,
}: WithdrawModalBodyProps) => {
  const [reason, setReason] = useState<WithdrawReasonValue | undefined>(defaultReason);
  const [detail, setDetail] = useState('');

  const detailEnabled = reason === 'other';
  const otherDetailFilled = detail.trim().length > 0;
  const canSubmit = reason != null && (reason !== 'other' ? true : otherDetailFilled);

  const handleSubmit = async () => {
    if (reason == null) {
      return;
    }
    if (reason === 'other' && !detail.trim()) {
      return;
    }
    await onSubmit?.({ reason, detail: detail.trim() });
    onClose();
    onWithdrawSubmitted();
  };

  return (
    <>
      <div className="flex shrink-0 flex-col gap-2 px-4">
        <Dialog.Title id={headingId} className="text-heading-base text-text-basic font-bold tracking-normal">
          회원 탈퇴
        </Dialog.Title>
        <Dialog.Description id={descriptionId} className="text-body-base text-text-subtle leading-normal font-normal">
          Sossbar를 떠나는 이유를 알려주세요
        </Dialog.Description>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4">
        <div className="flex shrink-0 flex-col gap-6">
          <RadioGroup.Root
            value={reason ?? ''}
            onValueChange={(next) => {
              if (!next) {
                setReason(undefined);
                setDetail('');
                return;
              }
              const nextReason = next as WithdrawReasonValue;
              setReason(nextReason);
              if (nextReason !== 'other') {
                setDetail('');
              }
            }}
            aria-label="탈퇴 사유 선택"
            className="flex shrink-0 flex-col gap-4"
          >
            {REASON_OPTIONS.map((opt) => (
              <RadioRow key={opt.value} value={opt.value} label={opt.label} checked={reason === opt.value} />
            ))}
          </RadioGroup.Root>

          <div className="w-full shrink-0">
            <Textarea
              label="탈퇴사유"
              placeholder="탈퇴사유를 입력해주세요."
              value={detail}
              disabled={!detailEnabled}
              onChange={(e) => {
                setDetail(e.target.value);
              }}
              textareaClassName={cn(
                'w-full min-h-[144px] max-h-[144px]',
                detailEnabled
                  ? 'border-border-gray-dark'
                  : 'border-input-border-disabled bg-input-surface-disabled text-text-disabled placeholder:text-text-disabled',
              )}
              className="w-full max-w-none"
            />
          </div>
        </div>

        <div className="mt-6 flex shrink-0 justify-end gap-2">
          <Button type="button" variant="tertiary" size="medium" className="h-11 min-w-[68px]" onClick={onClose}>
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            size="medium"
            className="h-11 min-w-[68px]"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            제출하기
          </Button>
        </div>
      </div>
    </>
  );
};

export const Dropmodal = ({ open, onOpenChange, onSubmit, onConfirm, defaultReason, className }: DropmodalProps) => {
  const headingId = useId();
  const descriptionId = useId();
  const [completeOpen, setCompleteOpen] = useState(false);

  const handleWithdrawOpenChange = (next: boolean) => {
    if (next) {
      setCompleteOpen(false);
    }
    onOpenChange(next);
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={handleWithdrawOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
          <Dialog.Content
            aria-labelledby={headingId}
            aria-describedby={descriptionId}
            className={cn(
              'border-border-gray bg-surface-white fixed top-1/2 left-1/2 z-50 flex h-[min(680px,calc(100vh-48px))] w-[min(592px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-hidden rounded-2xl border p-10 shadow-xl',
              className,
            )}
          >
            {open ? (
              <WithdrawModalBody
                headingId={headingId}
                descriptionId={descriptionId}
                defaultReason={defaultReason}
                onSubmit={onSubmit}
                onClose={() => {
                  handleWithdrawOpenChange(false);
                }}
                onWithdrawSubmitted={() => {
                  setCompleteOpen(true);
                }}
              />
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dropcomplete open={completeOpen} onOpenChange={setCompleteOpen} onConfirm={onConfirm} />
    </>
  );
};
