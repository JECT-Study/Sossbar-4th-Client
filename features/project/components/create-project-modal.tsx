'use client';

import { AnimatePresence } from 'motion/react';
import { Dialog } from 'radix-ui';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

import {
  PROJECT_FIELD_MAX_LENGTH,
  PROJECT_IMAGE_ACCEPT,
  PROJECT_POSITIONS_MAX_SELECT,
  PROJECT_POSITION_OPTIONS,
} from '@/features/project/project.constants';
import { FileUploadIcon, TrashIcon, XIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { DatePicker } from '@/shared/components/date-picker';
import { DialogAnimatedOverlay } from '@/shared/components/dialog';
import { ErrorMessage } from '@/shared/components/error-message';
import { useFileInput, useImagePreview } from '@/shared/components/file-input';
import { Input } from '@/shared/components/input';
import { Label } from '@/shared/components/label';
import { MultiSelectField } from '@/shared/components/multi-select-field';
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
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <DialogAnimatedOverlay />
            <Dialog.Content
              className={cn(
                'bg-surface-white fixed z-50 flex flex-col outline-none',
                // mobile: Figma 바텀시트(666px / 상단 178px 노출) — 헤더·푸터 고정, 본문 스크롤
                'inset-x-0 bottom-0 h-[min(666px,calc(100dvh-178px))] w-full overflow-hidden rounded-t-2xl',
                // desktop: centered modal
                'lg:border-border-gray lg:inset-x-auto lg:top-1/2 lg:bottom-auto lg:left-1/2 lg:h-auto lg:max-h-[calc(100vh-24px)] lg:w-[min(600px,calc(100vw-16px))] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-lg lg:border lg:px-11 lg:py-10 lg:shadow-xl',
                className,
              )}
            >
              {createdProjectLink !== null ? (
                <>
                  <div className="flex items-start gap-4 px-5 py-4 lg:px-0 lg:py-0">
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <Dialog.Title className="text-heading-base text-text-basic font-bold">
                        프로젝트가 생성되었습니다!
                      </Dialog.Title>
                      <Dialog.Description className="text-body-base text-text-subtle leading-normal">
                        아래 초대 링크를 복사해 팀원들에게 공유하세요.
                      </Dialog.Description>
                    </div>
                    <Dialog.Close
                      className="text-icon-gray hover:bg-surface-gray-subtler focus-visible:ring-border-primary inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm outline-none focus-visible:ring-2 lg:hidden"
                      aria-label="닫기"
                    >
                      <XIcon className="size-6" aria-hidden />
                    </Dialog.Close>
                  </div>

                  <div className="flex flex-col gap-3 px-5 lg:mt-4 lg:px-0">
                    <div className="border-border-gray bg-bg-subtle flex items-center gap-3 rounded-lg border px-4 py-3">
                      <p className="text-body-sm text-text-subtle min-w-0 flex-1 truncate">{inviteUrl}</p>
                      <Button type="button" variant="secondary" size="small" onClick={handleCopyLink}>
                        {linkCopied ? '복사됨' : '복사하기'}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-end gap-2 px-5 py-4 lg:mt-6 lg:px-0 lg:py-0">
                    <Button
                      type="button"
                      variant="primary"
                      size="medium"
                      className="h-11 w-full lg:w-auto"
                      onClick={() => handleOpenChange(false)}
                    >
                      닫기
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex shrink-0 items-start gap-4 px-5 py-4 lg:px-0 lg:py-0">
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <Dialog.Title className="text-body-base text-text-basic lg:text-heading-base font-bold">
                        새 프로젝트 생성
                      </Dialog.Title>
                      <Dialog.Description className="text-body-sm text-text-subtle sr-only leading-normal lg:not-sr-only lg:block">
                        <span className="block">프로젝트 정보를 입력하고 팀원들을 초대하세요.</span>
                        <span className="block">생성된 프로젝트는 내 페이지에 공개됩니다.</span>
                      </Dialog.Description>
                    </div>
                    <Dialog.Close
                      className="text-icon-gray hover:bg-surface-gray-subtler focus-visible:ring-border-primary inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm outline-none focus-visible:ring-2 lg:hidden"
                      aria-label="닫기"
                    >
                      <XIcon className="size-6" aria-hidden />
                    </Dialog.Close>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-5 pb-4 lg:mt-7 lg:px-0 lg:pr-2 lg:pb-0">
                      <Controller
                        control={control}
                        name="projectName"
                        render={({ field }) => (
                          <TextField
                            label="프로젝트명"
                            required
                            maxLength={PROJECT_FIELD_MAX_LENGTH}
                            placeholder="프로젝트명을 입력해주세요."
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
                            placeholder="주최사를 입력해주세요."
                            errorMessage={errors.host?.message}
                            disabled={isSubmitting}
                            clearable
                            className="-mt-2"
                            {...field}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name="projectPositions"
                        render={({ field }) => (
                          <MultiSelectField
                            name="projectPositions"
                            label="포지션"
                            required
                            options={PROJECT_POSITION_OPTIONS.map(({ value, label, Icon }) => ({
                              value,
                              label,
                              icon: <Icon className="size-4 shrink-0" aria-hidden />,
                            }))}
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            max={PROJECT_POSITIONS_MAX_SELECT}
                            placeholder="포지션을 선택해주세요."
                            className="-mt-2"
                            contentClassName="w-(--radix-popover-trigger-width)"
                          />
                        )}
                      />
                      {errors.projectPositions?.message ? (
                        <ErrorMessage className="static -mt-2">{errors.projectPositions.message}</ErrorMessage>
                      ) : (
                        <p className="text-detail-xs text-text-subtle -mt-2">최대 2개까지 등록 가능해요.</p>
                      )}

                      <div className="-mt-2 flex flex-col gap-2">
                        <Label required>날짜</Label>
                        <div className="flex items-center gap-2">
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
                                onBlur={field.onBlur}
                                placeholder="시작일"
                                disabled={isSubmitting}
                                error={!!errors.startDate}
                                className="min-w-0 flex-1"
                              />
                            )}
                          />
                          <span aria-hidden className="text-body-sm text-text-subtle shrink-0">
                            ~
                          </span>
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
                                onBlur={field.onBlur}
                                placeholder="완료일"
                                disabled={isSubmitting}
                                error={!!errors.endDate}
                                className="min-w-0 flex-1"
                              />
                            )}
                          />
                        </div>
                        {dateErrorMessage ? <ErrorMessage className="static">{dateErrorMessage}</ErrorMessage> : null}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label required>협업 인증 사진</Label>
                        <p className="text-detail-sm text-text-subtle hidden lg:block">
                          * 협업을 증명할 수 있는 이미지를 첨부해주세요. (로고/썸네일/레포지토리 등)
                        </p>
                        <Controller
                          control={control}
                          name="image"
                          render={({ field: { value, onChange, onBlur } }) => (
                            <ProjectImageInput
                              value={value}
                              onChange={onChange}
                              onBlur={onBlur}
                              disabled={isSubmitting}
                              accept={PROJECT_IMAGE_ACCEPT}
                              errorMessage={errors.image?.message}
                            />
                          )}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="project-url">URL</Label>
                        <Controller
                          control={control}
                          name="projectUrl"
                          render={({ field }) => (
                            <div className="flex items-center gap-2">
                              <Input
                                id="project-url"
                                placeholder="https://"
                                error={!!errors.projectUrl?.message}
                                disabled={isSubmitting}
                                className="min-w-0 flex-1"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="tertiary"
                                size="medium"
                                aria-label="URL 지우기"
                                disabled={isSubmitting || !field.value}
                                className="bg-button-tertiary-fill-hover h-12 shrink-0 px-2.5"
                                leftIcon={<TrashIcon className="size-5" aria-hidden />}
                                onClick={() => field.onChange('')}
                              />
                            </div>
                          )}
                        />
                        {errors.projectUrl?.message ? <ErrorMessage>{errors.projectUrl.message}</ErrorMessage> : null}
                      </div>
                    </div>

                    {errors.root?.message ? (
                      <ErrorMessage className="static px-5 lg:px-0">{errors.root.message}</ErrorMessage>
                    ) : null}

                    <div className="flex shrink-0 items-center gap-2 px-5 py-4 lg:mt-4 lg:justify-end lg:px-0 lg:py-0">
                      <Button
                        type="button"
                        variant="tertiary"
                        size="medium"
                        className="h-11 flex-1 lg:flex-none"
                        onClick={() => handleOpenChange(false)}
                        disabled={isSubmitting}
                      >
                        취소
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="medium"
                        className="h-11 flex-1 lg:flex-none"
                        disabled={!isValid || isSubmitting}
                      >
                        생성하기
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
};

interface ProjectImageInputProps {
  value: File | null;
  onChange: (file: File | null) => void;
  onBlur?: () => void;
  accept: string;
  disabled?: boolean;
  errorMessage?: string;
}

const ProjectImageInput = ({ value, onChange, onBlur, accept, disabled, errorMessage }: ProjectImageInputProps) => {
  const { previewUrl, onChange: syncPreview } = useImagePreview();
  const { inputRef, inputId, openPicker, handleFileChange } = useFileInput({ disabled, onChange });

  useEffect(() => {
    syncPreview(value);
  }, [syncPreview, value]);

  return (
    <div className="flex flex-col gap-2">
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

      {/* mobile: Figma 사진 업로드 버튼 + 안내 문구 */}
      <div className="flex items-center gap-3 lg:hidden">
        <Button
          type="button"
          variant="tertiary"
          size="medium"
          onClick={openPicker}
          onBlur={onBlur}
          disabled={disabled}
          className="border-border-gray text-text-subtle h-12 shrink-0 border px-4"
          leftIcon={<FileUploadIcon className="size-5 shrink-0" aria-hidden />}
        >
          사진 업로드
        </Button>
        <p className="text-detail-xs text-text-subtle min-w-0 leading-normal">
          JPG, JPEG, PNG 형식의 확장자
          <br />
          최소 100px × 100px 사이즈
        </p>
      </div>
      {previewUrl && value ? (
        <img
          src={previewUrl}
          alt="선택한 프로젝트 이미지 미리보기"
          className="size-25 rounded-xl object-cover lg:hidden"
        />
      ) : null}

      {/* desktop: 기존 미리보기 + 업로드 */}
      <div className="mt-2 hidden items-start gap-6 lg:flex">
        <img
          src={previewUrl ?? '/default.png'}
          alt={value === null ? '기본 프로젝트 이미지' : '선택한 프로젝트 이미지 미리보기'}
          className="size-25 shrink-0 rounded-xl object-cover"
        />
        <div className="flex min-w-0 flex-col gap-3">
          <Button
            type="button"
            variant="tertiary"
            size="small"
            onClick={openPicker}
            onBlur={onBlur}
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
