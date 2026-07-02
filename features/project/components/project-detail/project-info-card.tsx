'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import { Button } from '@/shared/components/button';
import { DatePicker } from '@/shared/components/date-picker';
import { ErrorMessage } from '@/shared/components/error-message';
import { FileInput, useImagePreview } from '@/shared/components/file-input';
import { Label } from '@/shared/components/label';
import { SectionCard, SectionInfoRow } from '@/shared/components/section-card';
import { Select } from '@/shared/components/select/select';
import { TextField } from '@/shared/components/text-field';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

import type { ProjectResponse } from '../../project.types';

import { PROJECT_FIELD_MAX_LENGTH, PROJECT_IMAGE_ACCEPT } from '../../project.constants';
import { useUpdateProjectModal } from '../../project.hooks';

const DEFAULT_PROJECT_IMAGE = '/default.png';
const IMAGE_GUIDE_TEXT = '□ JPG, JPEG, PNG 형식\n□ 최소 100 x 100px';
const PROJECT_INFO_EDIT_FORM_ID = 'project-info-edit-form';

interface Props {
  project: ProjectResponse;
  isLeader: boolean;
}

type UpdateProjectForm = ReturnType<typeof useUpdateProjectModal>['form'];
type UpdateProjectSubmit = ReturnType<typeof useUpdateProjectModal>['onSubmit'];

const formatDateRange = (startDate: string | null, endDate: string | null): string => {
  if (!startDate && !endDate) {
    return '-';
  }
  const start = startDate ? formatIsoDateToDots(startDate) : '';
  const end = endDate ? formatIsoDateToDots(endDate) : '';
  return `${start} - ${end}`;
};

export const ProjectInfoCard = ({ project, isLeader }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { form, handleOpenChange, isSubmitting, onSubmit } = useUpdateProjectModal({
    projectId: project.projectId,
    defaultProjectValues: {
      projectName: project.projectName,
      host: project.host,
      startDate: project.startDate ?? '',
      endDate: project.endDate ?? '',
      projectUrl: project.projectUrl ?? '',
      projectUrlType: 'LINK',
    },
    onOpenChange: setIsEditing,
  });

  // 팀 확정(IN_PROGRESS 종료) 이후에는 프로젝트 정보를 수정할 수 없으므로 수정 버튼을 숨긴다.
  const isEditable = isLeader && project.projectStatus === 'IN_PROGRESS';

  const action = !isEditable ? null : isEditing ? (
    <div className="flex gap-2">
      <Button type="button" variant="tertiary" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
        취소
      </Button>
      <Button
        type="submit"
        form={PROJECT_INFO_EDIT_FORM_ID}
        variant="tertiary"
        disabled={isSubmitting}
        className="border-border-gray-dark text-text-basic border"
      >
        저장
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      variant="tertiary"
      onClick={() => setIsEditing(true)}
      className="border-border-gray-dark text-text-subtle border"
    >
      수정
    </Button>
  );

  return (
    <SectionCard title="프로젝트 정보" action={action}>
      {isEditing ? (
        <ProjectInfoEditFields project={project} form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
      ) : (
        <ProjectInfoViewFields project={project} />
      )}
    </SectionCard>
  );
};

const ProjectInfoViewFields = ({ project }: { project: ProjectResponse }) => (
  <div className="flex flex-col gap-8">
    <SectionInfoRow label="프로젝트명">
      <span className="text-text-basic text-body-base">{project.projectName}</span>
    </SectionInfoRow>
    <SectionInfoRow label="주최사">
      <span className="text-text-basic text-body-base">{project.host}</span>
    </SectionInfoRow>
    <SectionInfoRow label="날짜">
      <span className="text-text-basic text-body-base">{formatDateRange(project.startDate, project.endDate)}</span>
    </SectionInfoRow>
    <SectionInfoRow label="협업 인증 사진" align="start">
      <div className="relative size-25 overflow-hidden rounded-2xl">
        <Image
          src={project.projectImage ?? DEFAULT_PROJECT_IMAGE}
          alt={`${project.projectName} 협업 인증 사진`}
          fill
          sizes="100px"
          className="object-cover"
        />
      </div>
    </SectionInfoRow>
    <SectionInfoRow label="URL">
      {project.projectUrl ? (
        <a
          href={project.projectUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-text-primary text-body-base underline"
        >
          {project.projectUrl}
        </a>
      ) : (
        <span className="text-text-subtle text-body-base">-</span>
      )}
    </SectionInfoRow>
  </div>
);

interface ProjectInfoEditFieldsProps {
  project: ProjectResponse;
  form: UpdateProjectForm;
  onSubmit: UpdateProjectSubmit;
  isSubmitting: boolean;
}

const ProjectInfoEditFields = ({ project, form, onSubmit, isSubmitting }: ProjectInfoEditFieldsProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    trigger,
  } = form;
  const dateErrorMessage = errors.startDate?.message ?? errors.endDate?.message;

  return (
    <form id={PROJECT_INFO_EDIT_FORM_ID} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <SectionInfoRow label="프로젝트명" align="start">
        <Controller
          control={control}
          name="projectName"
          render={({ field }) => (
            <TextField
              label="프로젝트명"
              required
              maxLength={PROJECT_FIELD_MAX_LENGTH}
              placeholder="프로젝트명을 입력하세요"
              errorMessage={errors.projectName?.message}
              disabled={isSubmitting}
              className="[&>label]:sr-only"
              {...field}
            />
          )}
        />
      </SectionInfoRow>

      <SectionInfoRow label="주최사" align="start">
        <Controller
          control={control}
          name="host"
          render={({ field }) => (
            <TextField
              label="주최사"
              required
              maxLength={PROJECT_FIELD_MAX_LENGTH}
              placeholder="주최사를 입력하세요"
              errorMessage={errors.host?.message}
              disabled={isSubmitting}
              className="[&>label]:sr-only"
              {...field}
            />
          )}
        />
      </SectionInfoRow>

      <SectionInfoRow label="날짜" align="start">
        <div className="flex flex-col gap-2">
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
                  placeholder="시작일"
                  disabled={isSubmitting}
                  error={!!errors.startDate}
                />
              )}
            />
            <span className="text-text-subtle text-body-base">-</span>
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
                  placeholder="종료일"
                  disabled={isSubmitting}
                  error={!!errors.endDate}
                />
              )}
            />
          </div>
          {dateErrorMessage ? <ErrorMessage className="static">{dateErrorMessage}</ErrorMessage> : null}
        </div>
      </SectionInfoRow>

      <SectionInfoRow label="협업 인증 사진" align="start">
        <Controller
          control={control}
          name="image"
          render={({ field: { value, onChange } }) => (
            <ProjectImageEditField
              project={project}
              value={value}
              onChange={onChange}
              disabled={isSubmitting}
              errorMessage={errors.image?.message}
            />
          )}
        />
      </SectionInfoRow>

      <SectionInfoRow label="URL" align="start">
        <div className="grid grid-cols-[1fr_120px] items-start gap-2">
          <Controller
            control={control}
            name="projectUrl"
            render={({ field }) => (
              <TextField
                label="URL"
                placeholder="https://"
                errorMessage={errors.projectUrl?.message}
                disabled={isSubmitting}
                className="[&>label]:sr-only"
                {...field}
                value={field.value ?? ''}
              />
            )}
          />
          <div className="flex flex-col gap-2">
            <Label className="sr-only">URL 유형</Label>
            <Controller
              control={control}
              name="projectUrlType"
              render={({ field }) => (
                <Select.Root value={field.value ?? 'LINK'} onValueChange={field.onChange} disabled={isSubmitting}>
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
        </div>
      </SectionInfoRow>

      {errors.root?.message ? <ErrorMessage className="static">{errors.root.message}</ErrorMessage> : null}
    </form>
  );
};

interface ProjectImageEditFieldProps {
  project: ProjectResponse;
  value: File | null;
  onChange: (file: File | null) => void;
  disabled: boolean;
  errorMessage?: string;
}

const ProjectImageEditField = ({ project, value, onChange, disabled, errorMessage }: ProjectImageEditFieldProps) => {
  const { previewUrl, onChange: syncPreview } = useImagePreview();
  const imageSrc = previewUrl ?? project.projectImage ?? DEFAULT_PROJECT_IMAGE;

  useEffect(() => {
    syncPreview(value);
  }, [syncPreview, value]);

  return (
    <div className="flex items-start gap-6">
      <img
        src={imageSrc}
        alt={`${project.projectName} 협업 인증 사진 미리보기`}
        className="size-25 shrink-0 rounded-2xl object-cover"
      />
      <div className="flex min-w-0 flex-col gap-2">
        <FileInput
          value={value}
          onChange={onChange}
          label="이미지 업로드하기"
          accept={PROJECT_IMAGE_ACCEPT}
          disabled={disabled}
          className="max-w-full"
        />
        <p className="text-body-sm text-text-subtler whitespace-pre-line">{IMAGE_GUIDE_TEXT}</p>
        {errorMessage ? <ErrorMessage className="static">{errorMessage}</ErrorMessage> : null}
      </div>
    </div>
  );
};
