'use client';

import { Dialog } from 'radix-ui';
import { useState } from 'react';

import { Button } from '@/shared/components/button';
import { DialogAnimatedPortal } from '@/shared/components/dialog';
import { MultiSelect } from '@/shared/components/multi-select';
import { cn } from '@/shared/lib/cn';

import type { ProjectPositionValue } from '../project.types';

import { PROJECT_INVITE_MAX_POSITIONS, PROJECT_POSITION_LABELS, PROJECT_POSITIONS } from '../project.constants';

type ProjectInviteAcceptModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (projectPositions: ProjectPositionValue[]) => void | Promise<void>;
  isConfirming?: boolean;
  errorMessage?: string;
};

export const ProjectInviteAcceptModal = ({
  open,
  onOpenChange,
  onConfirm,
  isConfirming = false,
  errorMessage,
}: ProjectInviteAcceptModalProps) => {
  // 선택 상태는 컴포넌트 로컬로만 관리한다. 핸들러가 projectLink 기준 key로 마운트하므로
  // 초대마다 새 인스턴스가 생성돼 별도 초기화 로직이 필요 없다.
  const [selectedPositions, setSelectedPositions] = useState<ProjectPositionValue[]>([]);

  const canConfirm = selectedPositions.length > 0 && !isConfirming;
  const isMaxPositionReached = selectedPositions.length >= PROJECT_INVITE_MAX_POSITIONS;

  const handleOpenChange = (next: boolean) => {
    if (!next && isConfirming) {
      return;
    }
    onOpenChange(next);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <DialogAnimatedPortal
        open={open}
        className={cn(
          'border-border-gray bg-surface-white fixed top-1/2 left-1/2 z-50 flex w-full max-w-[min(28rem,calc(100vw-40px))] flex-col',
          'gap-4 overflow-hidden rounded-xl border p-6 outline-none',
        )}
      >
        <div className="flex w-full min-w-0 flex-col gap-2 py-2">
          <Dialog.Title className="text-heading-base text-text-basic leading-normal font-bold">
            프로젝트 참여
          </Dialog.Title>
          <Dialog.Description className="text-body-base text-text-subtle leading-normal">
            이번 프로젝트에서 본인의 역할을 선택해주세요.
          </Dialog.Description>

          <div className="flex w-full min-w-0 flex-col gap-2">
            <MultiSelect.Root
              value={selectedPositions}
              onValueChange={(value) => setSelectedPositions(value as ProjectPositionValue[])}
            >
              <MultiSelect.Trigger disabled={isConfirming}>
                {selectedPositions.length === 0 ? (
                  <span className="text-text-disabled">직군을 선택해주세요</span>
                ) : (
                  selectedPositions.map((position) => (
                    <MultiSelect.Tag key={position} value={position}>
                      {PROJECT_POSITION_LABELS[position]}
                    </MultiSelect.Tag>
                  ))
                )}
              </MultiSelect.Trigger>
              <MultiSelect.Content className="w-(--radix-popover-trigger-width)">
                {PROJECT_POSITIONS.map((position) => (
                  <MultiSelect.Item
                    key={position}
                    value={position}
                    disabled={isConfirming || (isMaxPositionReached && !selectedPositions.includes(position))}
                  >
                    {PROJECT_POSITION_LABELS[position]}
                  </MultiSelect.Item>
                ))}
              </MultiSelect.Content>
            </MultiSelect.Root>
            <p className="text-body-sm text-text-subtle leading-normal">
              최대 {PROJECT_INVITE_MAX_POSITIONS}개까지 등록 가능해요.
            </p>
          </div>
        </div>

        {!!errorMessage && (
          <p className="text-body-sm text-text-error" role="alert">
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
      </DialogAnimatedPortal>
    </Dialog.Root>
  );
};
