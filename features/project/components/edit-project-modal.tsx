'use client';

import { Dialog } from 'radix-ui';
import { useId, useState } from 'react';

import { useUpdateProject } from '@/features/project/api/mutations';
import { FileAttach } from '@/shared/components/attach';
import { Button } from '@/shared/components/button';
import { Label } from '@/shared/components/label';
import { TextField } from '@/shared/components/text-field';
import { cn } from '@/shared/lib/cn';

const MAX_FIELD_LENGTH = 20;

export type EditProjectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  initialProjectName: string;
  initialHost: string;
  className?: string;
};

export const EditProjectModal = ({
  open,
  onOpenChange,
  projectId,
  initialProjectName,
  initialHost,
  className,
}: EditProjectModalProps) => {
  const headingId = useId();
  const descriptionId = useId();
  const [projectName, setProjectName] = useState(initialProjectName);
  const [host, setHost] = useState(initialHost);
  const [image, setImage] = useState<File | null>(null);

  const { mutate: updateProject, isPending } = useUpdateProject(projectId);

  const canSubmit = projectName.trim().length > 0 && host.trim().length > 0 && !isPending;

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setProjectName(initialProjectName);
      setHost(initialHost);
      setImage(null);
    }
    onOpenChange(next);
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    updateProject(
      {
        request: {
          projectName: projectName.trim(),
          host: host.trim(),
        },
        image,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content
          aria-labelledby={headingId}
          aria-describedby={descriptionId}
          className={cn(
            'border-border-gray bg-surface-white fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100vh-48px)] w-[min(592px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-y-auto rounded-xl border p-10 shadow-xl',
            className,
          )}
        >
          <div className="flex flex-col gap-2 px-4">
            <Dialog.Title id={headingId} className="text-heading-base text-text-basic font-bold">
              프로젝트 수정
            </Dialog.Title>
            <Dialog.Description id={descriptionId} className="text-body-base text-text-subtle leading-normal">
              프로젝트명과 주최사를 수정할 수 있습니다. 이미지를 바꾸지 않으면 기존 사진이 유지됩니다.
            </Dialog.Description>
          </div>

          <div className="flex flex-col gap-2 px-4">
            <TextField
              name="projectName"
              label="프로젝트명"
              required
              maxLength={MAX_FIELD_LENGTH}
              placeholder="내용을 입력하세요"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <TextField
              name="host"
              label="주최사"
              required
              maxLength={MAX_FIELD_LENGTH}
              placeholder="내용을 입력하세요"
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <Label>협업 인증 사진 첨부</Label>
              <p className="text-detail-sm text-text-subtle">* 변경 시에만 새 이미지를 선택하세요.</p>
              <FileAttach
                value={image}
                onChange={setImage}
                label="이미지 업로드하기"
                accept="image/jpeg,image/jpg,image/png"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="tertiary" size="medium" onClick={() => handleOpenChange(false)}>
              취소
            </Button>
            <Button type="button" variant="primary" size="medium" disabled={!canSubmit} onClick={handleSubmit}>
              저장하기
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
