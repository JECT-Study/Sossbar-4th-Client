'use client';

import { Dialog } from 'radix-ui';
import { useState } from 'react';

import { Button } from '@/shared/components/button';
import { cn } from '@/shared/lib/cn';

import type { ProjectPositionValue } from '../project.types';

import { PROJECT_INVITE_MAX_POSITIONS, PROJECT_POSITION_LABELS, PROJECT_POSITIONS } from '../project.constants';

type ProjectInviteAcceptModalProps = {
  open: boolean;
  /** 링크를 공유한 사람의 이름. 백엔드 조회 없이 표시할 수 있는 유일한 프로젝트 맥락이다. */
  inviterName?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (projectPositions: ProjectPositionValue[]) => void | Promise<void>;
  isConfirming?: boolean;
  errorMessage?: string;
};

export const ProjectInviteAcceptModal = ({
  open,
  inviterName,
  onOpenChange,
  onConfirm,
  isConfirming = false,
  errorMessage,
}: ProjectInviteAcceptModalProps) => {
  // 선택 상태는 컴포넌트 로컬로만 관리한다. 핸들러가 projectLink 기준 key로 마운트하므로
  // 초대마다 새 인스턴스가 생성돼 별도 초기화 로직이 필요 없다.
  const [selectedPositions, setSelectedPositions] = useState<Set<ProjectPositionValue>>(() => new Set());

  const togglePosition = (position: ProjectPositionValue) => {
    setSelectedPositions((prev) => {
      const next = new Set(prev);
      if (next.has(position)) {
        next.delete(position);
        return next;
      }
      if (next.size >= PROJECT_INVITE_MAX_POSITIONS) {
        return prev;
      }
      next.add(position);
      return next;
    });
  };

  const canConfirm = selectedPositions.size > 0 && !isConfirming;

  const handleOpenChange = (next: boolean) => {
    if (!next && isConfirming) {
      return;
    }
    onOpenChange(next);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black-75 fixed inset-0 z-50" />
        <Dialog.Content
          className={cn(
            'border-border-gray bg-surface-white fixed top-1/2 left-1/2 z-50 flex w-[360px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 flex-col',
            'gap-4 overflow-hidden rounded-xl border p-6 outline-none',
          )}
        >
          <div className="flex w-full shrink-0 flex-col gap-2 px-4 py-2">
            <Dialog.Title className="text-heading-base text-text-basic leading-normal font-bold">
              후기 작성
            </Dialog.Title>
            <Dialog.Description asChild>
              <div className="text-body-base text-text-subtle flex flex-col leading-normal">
                <span>
                  {inviterName ? <span className="text-text-basic font-bold">{inviterName}님이 초대한 </span> : null}
                  프로젝트의 후기 작성에 참여하시겠습니까?
                </span>
              </div>
            </Dialog.Description>
          </div>

          <div className="flex flex-col gap-2 px-4">
            <p className="text-body-sm text-text-basic font-medium">
              이 프로젝트에서 맡은 직군을 선택해주세요. (최대 {PROJECT_INVITE_MAX_POSITIONS}개)
            </p>
            <div className="flex flex-wrap gap-2">
              {PROJECT_POSITIONS.map((position) => {
                const selected = selectedPositions.has(position);
                const disabled = !selected && selectedPositions.size >= PROJECT_INVITE_MAX_POSITIONS;
                return (
                  <button
                    key={position}
                    type="button"
                    aria-pressed={selected}
                    disabled={disabled || isConfirming}
                    className={cn(
                      'text-body-sm inline-flex h-[33px] shrink-0 items-center justify-center rounded-full border px-3 font-normal transition-colors outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-primary) focus-visible:ring-offset-1',
                      selected
                        ? 'border-border-gray-light bg-action-secondary-pressed text-text-basic'
                        : 'border-border-gray-light bg-action-gray-light text-text-basic hover:border-action-secondary-hover hover:bg-action-secondary-hover',
                      disabled &&
                        'hover:border-border-gray-light hover:bg-action-gray-light cursor-not-allowed opacity-30',
                    )}
                    onClick={() => togglePosition(position)}
                  >
                    {PROJECT_POSITION_LABELS[position]}
                  </button>
                );
              })}
            </div>
          </div>

          {!!errorMessage && (
            <p className="text-body-sm text-text-error px-4" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="flex w-full shrink-0 justify-end gap-2">
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="tertiary"
                size="medium"
                className="h-11 min-w-[68px] shrink-0 px-5"
                disabled={isConfirming}
              >
                취소
              </Button>
            </Dialog.Close>
            <Button
              type="button"
              variant="primary"
              size="medium"
              className="h-11 min-w-[68px] shrink-0 px-5"
              disabled={!canConfirm}
              onClick={() => {
                void onConfirm([...selectedPositions]);
              }}
            >
              참여하기
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
