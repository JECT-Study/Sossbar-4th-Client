'use client';

import { Controller } from 'react-hook-form';

import { CharCount } from '@/shared/components/char-count';
import { DatePicker } from '@/shared/components/date-picker';
import { ErrorMessage } from '@/shared/components/error-message';
import { ImageFileInput } from '@/shared/components/file-input';
import { Label } from '@/shared/components/label';
import { SectionInfoRow } from '@/shared/components/section-card';
import { Select } from '@/shared/components/select/select';
import { TextField } from '@/shared/components/text-field';

import type { ProjectDetailInfoFormValues } from '../project.hooks';
import type { UseFormReturn } from 'react-hook-form';

import { PROJECT_FIELD_MAX_LENGTH, PROJECT_IMAGE_ACCEPT } from '../project.constants';

const IMAGE_GUIDE_TEXT = '□ JPG, JPEG, PNG 형식\n□ 최소 100 x 100px';

interface Props {
  form: UseFormReturn<ProjectDetailInfoFormValues>;
}

const parseDateString = (value: string | null): Date | null => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateToIso = (date: Date | null): string | null => {
  if (date == null) {
    return null;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const ProjectInfoEdit = ({ form }: Props) => {
  const {
    control,
    formState: { errors },
    watch,
  } = form;

  const hostValue = watch('host') ?? '';
  const projectNameValue = watch('projectName') ?? '';

  return (
    <div className="flex flex-col gap-8">
      <SectionInfoRow label="주최사" align="start">
        <Controller
          control={control}
          name="host"
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <TextField
                label="주최사"
                required
                maxLength={PROJECT_FIELD_MAX_LENGTH}
                placeholder="주최사를 입력하세요"
                errorMessage={errors.host?.message}
                className="[&>label]:sr-only"
                {...field}
              />
              <CharCount current={hostValue.length} max={PROJECT_FIELD_MAX_LENGTH} />
            </div>
          )}
        />
      </SectionInfoRow>

      <SectionInfoRow label="프로젝트명" align="start">
        <Controller
          control={control}
          name="projectName"
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <TextField
                label="프로젝트명"
                required
                maxLength={PROJECT_FIELD_MAX_LENGTH}
                placeholder="프로젝트명을 입력하세요"
                errorMessage={errors.projectName?.message}
                className="[&>label]:sr-only"
                {...field}
              />
              <CharCount current={projectNameValue.length} max={PROJECT_FIELD_MAX_LENGTH} />
            </div>
          )}
        />
      </SectionInfoRow>

      <SectionInfoRow label="날짜" align="start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  value={parseDateString(field.value)}
                  onChange={(date) => field.onChange(formatDateToIso(date))}
                  placeholder="시작일"
                />
              )}
            />
            <span className="text-text-subtle text-body-base">-</span>
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <DatePicker
                  value={parseDateString(field.value)}
                  onChange={(date) => field.onChange(formatDateToIso(date))}
                  placeholder="종료일"
                />
              )}
            />
          </div>
          {errors.endDate?.message ? <ErrorMessage className="static">{errors.endDate.message}</ErrorMessage> : null}
        </div>
      </SectionInfoRow>

      <SectionInfoRow label="협업 인증 사진" align="start">
        <div className="flex flex-col gap-2">
          <Controller
            control={control}
            name="image"
            render={({ field: { value, onChange } }) => (
              <ImageFileInput
                value={value instanceof File ? value : null}
                onChange={onChange}
                label="이미지 업로드하기"
                accept={PROJECT_IMAGE_ACCEPT}
                errorMessage={typeof errors.image?.message === 'string' ? errors.image.message : undefined}
              />
            )}
          />
          <p className="text-body-sm text-text-subtler whitespace-pre-line">{IMAGE_GUIDE_TEXT}</p>
        </div>
      </SectionInfoRow>

      <SectionInfoRow label="URL" align="start">
        <div className="grid grid-cols-[1fr_120px] items-start gap-2">
          <Controller
            control={control}
            name="projectLink"
            render={({ field }) => (
              <TextField
                label="URL"
                placeholder="https://"
                errorMessage={errors.projectLink?.message}
                className="[&>label]:sr-only"
                {...field}
              />
            )}
          />
          <div className="flex flex-col gap-2">
            <Label className="sr-only">URL 유형</Label>
            <Select.Root value="link" onValueChange={() => undefined}>
              <Select.Trigger aria-label="URL 유형">
                <Select.Value />
              </Select.Trigger>
              <Select.Content className="w-(--radix-select-trigger-width)">
                <Select.Item value="link">Link</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </SectionInfoRow>

      {errors.root?.message ? <ErrorMessage className="static">{errors.root.message}</ErrorMessage> : null}
    </div>
  );
};
