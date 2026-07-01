'use client';

import { Dialog } from 'radix-ui';
import { Controller } from 'react-hook-form';

import { PROJECT_FIELD_MAX_LENGTH, PROJECT_IMAGE_ACCEPT } from '@/features/project/project.constants';
import { Button } from '@/shared/components/button';
import { ErrorMessage } from '@/shared/components/error-message';
import { ImageFileInput } from '@/shared/components/file-input';
import { Label } from '@/shared/components/label';
import { TextField } from '@/shared/components/text-field';
import { cn } from '@/shared/lib/cn';

import { useUpdateProjectModal } from '../project.hooks';

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
  const { form, handleOpenChange, isSubmitting, onSubmit } = useUpdateProjectModal({
    projectId,
    defaultProjectValues: { projectName: defaultProjectName, host: defaultHost },
    onOpenChange,
  });
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
          <div className="flex flex-col gap-2 px-4">
            <Dialog.Title className="text-heading-base text-text-basic font-bold">프로젝트 수정</Dialog.Title>
            <Dialog.Description className="text-body-base text-text-subtle leading-normal">
              프로젝트명과 주최사를 수정할 수 있습니다. 이미지를 새로 올리면 대표 이미지가 바뀝니다.
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
              <Label>협업 인증 사진 (선택)</Label>
              <p className="text-detail-sm text-text-subtle">
                * JPG, JPEG, PNG 형식. 비워 두면 기존 이미지를 유지합니다.
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
                저장하기
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
