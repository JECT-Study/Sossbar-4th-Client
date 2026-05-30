'use client';

import { Dialog } from 'radix-ui';
import { useId, useState } from 'react';

import { useCreateProject } from '@/features/project/api/mutations';
import { buildProjectInviteUrl } from '@/features/project/lib/build-project-invite-url';
import { Button } from '@/shared/components/button';
import { FileInput } from '@/shared/components/file-input';
import { Label } from '@/shared/components/label';
import { TextField } from '@/shared/components/text-field';
import { cn } from '@/shared/lib/cn';

const MAX_FIELD_LENGTH = 20;

export type CreateProjectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

export const CreateProjectModal = ({ open, onOpenChange, className }: CreateProjectModalProps) => {
  const headingId = useId();
  const descriptionId = useId();
  const [projectName, setProjectName] = useState('');
  const [host, setHost] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const { mutate: createProject, isPending } = useCreateProject();

  const canSubmit = projectName.trim().length > 0 && host.trim().length > 0 && image != null && !isPending;

  const resetAll = () => {
    setProjectName('');
    setHost('');
    setImage(null);
    setCreatedProjectId(null);
    setLinkCopied(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      resetAll();
    }
    onOpenChange(next);
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    createProject(
      {
        request: {
          projectName: projectName.trim(),
          host: host.trim(),
        },
        image,
      },
      {
        onSuccess: (data) => {
          setProjectName('');
          setHost('');
          setImage(null);
          setCreatedProjectId(data.projectId);
        },
      },
    );
  };

  const handleCopyLink = () => {
    if (createdProjectId === null) {
      return;
    }
    const url = buildProjectInviteUrl(createdProjectId);
    void navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 3000);
    });
  };

  const handleClose = () => {
    resetAll();
    onOpenChange(false);
  };

  const inviteUrl = createdProjectId !== null ? buildProjectInviteUrl(createdProjectId) : '';

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
          {createdProjectId !== null ? (
            <>
              <div className="flex flex-col gap-2 px-4">
                <Dialog.Title id={headingId} className="text-heading-base text-text-basic font-bold">
                  프로젝트가 생성되었습니다!
                </Dialog.Title>
                <Dialog.Description id={descriptionId} className="text-body-base text-text-subtle leading-normal">
                  아래 초대 링크를 복사해 팀원들에게 공유하세요.
                </Dialog.Description>
              </div>

              <div className="flex flex-col gap-3 px-4">
                <div className="border-border-gray bg-bg-subtle flex items-center gap-3 rounded-lg border px-4 py-3">
                  <p className="text-body-sm text-text-subtle min-w-0 flex-1 truncate">{inviteUrl}</p>
                  <Button type="button" variant="secondary" size="small" onClick={handleCopyLink}>
                    {linkCopied ? '복사됨' : '복사하기'}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="primary" size="medium" onClick={handleClose}>
                  닫기
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2 px-4">
                <Dialog.Title id={headingId} className="text-heading-base text-text-basic font-bold">
                  새 프로젝트 생성
                </Dialog.Title>
                <Dialog.Description id={descriptionId} className="text-body-base text-text-subtle leading-normal">
                  <span className="block">프로젝트 정보를 입력하고 팀원들을 초대하세요.</span>
                  <span className="block">생성된 프로젝트는 내 페이지에 공개됩니다.</span>
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
                  <Label required>협업 인증 사진 첨부</Label>
                  <p className="text-detail-sm text-text-subtle">
                    * JPG, JPEG, PNG 형식의 이미지를 첨부할 수 있습니다.
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
                  생성하기
                </Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
