'use client';

import { Dialog } from 'radix-ui';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { PROJECT_FIELD_MAX_LENGTH, PROJECT_IMAGE_ACCEPT } from '@/features/project/project.constants';
import { FileUploadIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { DatePicker } from '@/shared/components/date-picker';
import { ErrorMessage } from '@/shared/components/error-message';
import { useFileInput, useImagePreview } from '@/shared/components/file-input';
import { Input } from '@/shared/components/input';
import { Label } from '@/shared/components/label';
import { Select } from '@/shared/components/select';
import { TextField } from '@/shared/components/text-field';
import { cn } from '@/shared/lib/cn';

import { useCreateProjectModal } from '../project.hooks';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export const CreateProjectModal = ({ open, onOpenChange, className }: Props) => {
  const { createdProjectLink, form, handleCopyLink, handleOpenChange, inviteUrl, isSubmitting, linkCopied, onSubmit } =
    useCreateProjectModal({ onOpenChange });
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    trigger,
  } = form;
  const dateErrorMessage = errors.startDate?.message ?? errors.endDate?.message;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content
          className={cn(
            'border-border-gray bg-surface-white fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100vh-24px)] w-[min(600px,calc(100vw-16px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border px-11 py-10 shadow-xl',
            className,
          )}
        >
          {createdProjectLink !== null ? (
            <>
              <div className="flex flex-col gap-2">
                <Dialog.Title className="text-heading-base text-text-basic font-bold">
                  프로젝트가 생성되었습니다!
                </Dialog.Title>
                <Dialog.Description className="text-body-base text-text-subtle leading-normal">
                  아래 초대 링크를 복사해 팀원들에게 공유하세요.
                </Dialog.Description>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <div className="border-border-gray bg-bg-subtle flex items-center gap-3 rounded-lg border px-4 py-3">
                  <p className="text-body-sm text-text-subtle min-w-0 flex-1 truncate">{inviteUrl}</p>
                  <Button type="button" variant="secondary" size="small" onClick={handleCopyLink}>
                    {linkCopied ? '복사됨' : '복사하기'}
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <Button type="button" variant="primary" size="medium" onClick={() => handleOpenChange(false)}>
                  닫기
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <Dialog.Title className="text-heading-base text-text-basic font-bold">새 프로젝트 생성</Dialog.Title>
                <Dialog.Description className="text-body-sm text-text-subtle leading-normal">
                  <span className="block">프로젝트 정보를 입력하고 팀원들을 초대하세요.</span>
                  <span className="block">생성된 프로젝트는 내 페이지에 공개됩니다.</span>
                </Dialog.Description>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex min-h-0 flex-1 flex-col">
                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-2">
                  <Controller
                    control={control}
                    name="projectName"
                    render={({ field }) => (
                      <TextField
                        label="프로젝트명"
                        required
                        maxLength={PROJECT_FIELD_MAX_LENGTH}
                        placeholder="2024 해커톤 프로젝트"
                        errorMessage={errors.projectName?.message}
                        disabled={isSubmitting}
                        clearable
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
                        placeholder="테크 스타트업 캠퍼니"
                        errorMessage={errors.host?.message}
                        disabled={isSubmitting}
                        clearable
                        className="-mt-2"
                        {...field}
                      />
                    )}
                  />

                  <div className="-mt-2 flex flex-col gap-2">
                    <Label required>날짜</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Controller
                        control={control}
                        name="startDate"
                        render={({ field }) => (
                          <DatePicker
                            value={field.value}
                            onChange={(date) => {
                              field.onChange(date);
                              void trigger(['startDate', 'endDate']);
                            }}
                            placeholder="시작일을 선택해주세요"
                            disabled={isSubmitting}
                            error={!!errors.startDate}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="endDate"
                        render={({ field }) => (
                          <DatePicker
                            value={field.value}
                            onChange={(date) => {
                              field.onChange(date);
                              void trigger(['startDate', 'endDate']);
                            }}
                            placeholder="완료일을 선택해주세요"
                            disabled={isSubmitting}
                            error={!!errors.endDate}
                          />
                        )}
                      />
                    </div>
                    {dateErrorMessage ? <ErrorMessage className="static">{dateErrorMessage}</ErrorMessage> : null}
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label required>협업 인증 사진 첨부</Label>
                    <p className="text-detail-sm text-text-subtle">
                      * 협업을 증명할 수 있는 이미지를 첨부해주세요. (로고/썸네일/레포지토리 등)
                    </p>
                    <Controller
                      control={control}
                      name="image"
                      render={({ field: { value, onChange } }) => (
                        <ProjectImageInput
                          value={value}
                          onChange={onChange}
                          disabled={isSubmitting}
                          accept={PROJECT_IMAGE_ACCEPT}
                          errorMessage={errors.image?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="project-url">URL</Label>
                    <div className="grid grid-cols-[1fr_120px] gap-2">
                      <Controller
                        control={control}
                        name="projectUrl"
                        render={({ field }) => (
                          <Input
                            id="project-url"
                            placeholder="https://"
                            error={!!errors.projectUrl?.message}
                            disabled={isSubmitting}
                            {...field}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="projectUrlType"
                        render={({ field }) => (
                          <Select.Root value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                            <Select.Trigger aria-label="URL 유형">
                              <Select.Value />
                            </Select.Trigger>
                            <Select.Content className="w-(--radix-select-trigger-width)">
                              <Select.Item value="LINK">Link</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        )}
                      />
                    </div>
                    {errors.projectUrl?.message ? <ErrorMessage>{errors.projectUrl.message}</ErrorMessage> : null}
                  </div>
                </div>

                {errors.root?.message ? <ErrorMessage className="static">{errors.root.message}</ErrorMessage> : null}

                <div className="mt-4 flex shrink-0 items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="tertiary"
                    size="medium"
                    onClick={() => handleOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    취소
                  </Button>
                  <Button type="submit" variant="primary" size="medium" disabled={!isValid || isSubmitting}>
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

interface ProjectImageInputProps {
  value: File | null;
  onChange: (file: File | null) => void;
  accept: string;
  disabled?: boolean;
  errorMessage?: string;
}

const ProjectImageInput = ({ value, onChange, accept, disabled, errorMessage }: ProjectImageInputProps) => {
  const { previewUrl, onChange: syncPreview } = useImagePreview();
  const { inputRef, inputId, openPicker, handleFileChange } = useFileInput({ disabled, onChange });

  useEffect(() => {
    syncPreview(value);
  }, [syncPreview, value]);

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-start gap-6">
        <img
          src={previewUrl ?? '/default.png'}
          alt={value === null ? '기본 프로젝트 이미지' : '선택한 프로젝트 이미지 미리보기'}
          className="size-25 shrink-0 rounded-xl object-cover"
        />
        <div className="flex min-w-0 flex-col gap-3">
          <input
            id={inputId}
            ref={inputRef}
            type="file"
            disabled={disabled}
            accept={accept}
            className="sr-only"
            tabIndex={-1}
            onChange={handleFileChange}
            aria-hidden
          />
          <Button
            type="button"
            variant="tertiary"
            size="small"
            onClick={openPicker}
            disabled={disabled}
            className="border-button-tertiary-fill-pressed border px-4 py-2.5"
            leftIcon={<FileUploadIcon className="size-5 shrink-0" aria-hidden />}
          >
            이미지 업로드하기
          </Button>
          <p className="text-detail-sm text-text-subtler whitespace-pre-line">
            □ JPG, JPEG, PNG 형식의 확장자{'\n'}□ 최소 100px X 100px 사이즈
          </p>
        </div>
      </div>
      {errorMessage ? <ErrorMessage className="static">{errorMessage}</ErrorMessage> : null}
    </div>
  );
};
