'use client';

import { Dialog } from 'radix-ui';
import { useState } from 'react';

import { useUpdateProject } from '@/features/project/api/mutations';
import { Button } from '@/shared/components/button';
import { FileInput } from '@/shared/components/file-input';
import { Label } from '@/shared/components/label';
import { TextField } from '@/shared/components/text-field';
import { cn } from '@/shared/lib/cn';

const MAX_FIELD_LENGTH = 20;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  defaultProjectName: string;
  defaultHost: string;
  className?: string;
}

export const EditProjectModal = ({
  open,
  onOpenChange,
  projectId,
  defaultProjectName,
  defaultHost,
  className,
}: Props) => {
  const [projectName, setProjectName] = useState(defaultProjectName);
  const [host, setHost] = useState(defaultHost);
  const [image, setImage] = useState<File | null>(null);

  const { mutate: updateProject, isPending } = useUpdateProject(projectId);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setImage(null);
    }
    onOpenChange(next);
  };

  const canSubmit = projectName.trim().length > 0 && host.trim().length > 0 && !isPending;

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
          setImage(null);
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
          className={cn(
            'border-border-gray bg-surface-white fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100vh-48px)] w-[min(592px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-y-auto rounded-xl border p-10 shadow-xl',
            className,
          )}
        >
          <div className="flex flex-col gap-2 px-4">
            <Dialog.Title className="text-heading-base text-text-basic font-bold">프로젝트 수정</Dialog.Title>
            <Dialog.Description className="text-body-base text-text-subtle leading-normal">
              프로젝트명과 주최사를 수정할 수 있습니다. 이미지를 새로 올리면 대표 이미지가 바뀝니다.
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
              <Label>협업 인증 사진 (선택)</Label>
              <p className="text-detail-sm text-text-subtle">
                * JPG, JPEG, PNG 형식. 비워 두면 기존 이미지를 유지합니다.
              </p>
              <FileInput
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
