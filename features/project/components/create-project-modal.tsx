'use client';

import { Dialog } from 'radix-ui';
import { Controller } from 'react-hook-form';

import { useCreateProjectModal } from '@/features/project/hooks/use-create-project-modal';
import { PROJECT_FIELD_MAX_LENGTH, PROJECT_IMAGE_ACCEPT } from '@/features/project/project.constants';
import { Button } from '@/shared/components/button';
import { ErrorMessage } from '@/shared/components/error-message';
import { ImageFileInput } from '@/shared/components/file-input';
import { Label } from '@/shared/components/label';
import { TextField } from '@/shared/components/text-field';
import { cn } from '@/shared/lib/cn';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export const CreateProjectModal = ({ open, onOpenChange, className }: Props) => {
  const { createdProjectId, form, handleCopyLink, handleOpenChange, inviteUrl, isSubmitting, linkCopied, onSubmit } =
    useCreateProjectModal({ onOpenChange });
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = form;

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
          {createdProjectId !== null ? (
            <>
              <div className="flex flex-col gap-2 px-4">
                <Dialog.Title className="text-heading-base text-text-basic font-bold">
                  프로젝트가 생성되었습니다!
                </Dialog.Title>
                <Dialog.Description className="text-body-base text-text-subtle leading-normal">
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
                <Button type="button" variant="primary" size="medium" onClick={() => handleOpenChange(false)}>
                  닫기
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2 px-4">
                <Dialog.Title className="text-heading-base text-text-basic font-bold">새 프로젝트 생성</Dialog.Title>
                <Dialog.Description className="text-body-base text-text-subtle leading-normal">
                  <span className="block">프로젝트 정보를 입력하고 팀원들을 초대하세요.</span>
                  <span className="block">생성된 프로젝트는 내 페이지에 공개됩니다.</span>
                </Dialog.Description>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 px-4">
                <Controller
                  control={control}
                  name="projectName"
                  render={({ field }) => (
                    <TextField
                      label="프로젝트명"
                      required
                      maxLength={PROJECT_FIELD_MAX_LENGTH}
                      placeholder="내용을 입력하세요"
                      errorMessage={errors.projectName?.message}
                      disabled={isSubmitting}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="host"
                  render={({ field }) => (
                    <TextField
                      label="주최사"
                      required
                      maxLength={PROJECT_FIELD_MAX_LENGTH}
                      placeholder="내용을 입력하세요"
                      errorMessage={errors.host?.message}
                      disabled={isSubmitting}
                      {...field}
                    />
                  )}
                />

                <div className="flex flex-col gap-2">
                  <Label required>협업 인증 사진 첨부</Label>
                  <p className="text-detail-sm text-text-subtle">
                    프로젝트 썸네일, 깃허브 레포지토리 제목 또는 로고 등의 이미지를 첨부해주세요.
                  </p>
                  <p className="text-detail-sm text-text-subtle">
                    * JPG, JPEG, PNG 형식의 이미지를 첨부할 수 있습니다.
                  </p>
                  <Controller
                    control={control}
                    name="image"
                    render={({ field: { value, onChange } }) => (
                      <ImageFileInput
                        value={value}
                        onChange={onChange}
                        label="이미지 업로드하기"
                        accept={PROJECT_IMAGE_ACCEPT}
                        errorMessage={errors.image?.message}
                      />
                    )}
                  />
                </div>

                {errors.root?.message ? <ErrorMessage className="static">{errors.root.message}</ErrorMessage> : null}

                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="tertiary"
                    size="medium"
                    onClick={() => handleOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    취소
                  </Button>
                  <Button type="submit" variant="primary" size="medium" disabled={isSubmitting}>
                    생성하기
                  </Button>
                </div>
              </form>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
