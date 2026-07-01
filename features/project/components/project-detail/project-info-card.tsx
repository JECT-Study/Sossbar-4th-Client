'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/shared/components/button';
import { CharCount } from '@/shared/components/char-count';
import { DatePicker } from '@/shared/components/date-picker';
import { ImageFileInput } from '@/shared/components/file-input';
import { Label } from '@/shared/components/label';
import { SectionCard, SectionInfoRow } from '@/shared/components/section-card';
import { Select } from '@/shared/components/select/select';
import { TextField } from '@/shared/components/text-field';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

import type { ProjectResponse } from '../../project.types';

import { PROJECT_FIELD_MAX_LENGTH, PROJECT_IMAGE_ACCEPT } from '../../project.constants';

const DEFAULT_PROJECT_IMAGE = '/default.png';
const IMAGE_GUIDE_TEXT = '□ JPG, JPEG, PNG 형식\n□ 최소 100 x 100px';

interface Props {
  project: ProjectResponse;
  isLeader: boolean;
}

const formatDateRange = (startDate: string | null, endDate: string | null): string => {
  if (!startDate && !endDate) {
    return '-';
  }
  const start = startDate ? formatIsoDateToDots(startDate) : '';
  const end = endDate ? formatIsoDateToDots(endDate) : '';
  return `${start} - ${end}`;
};

const parseDate = (value: string | null): Date | null => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const ProjectInfoCard = ({ project, isLeader }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const action = !isLeader ? null : isEditing ? (
    <div className="flex gap-2">
      <Button type="button" variant="tertiary" onClick={() => setIsEditing(false)} className="text-text-basic">
        취소
      </Button>
      <Button
        type="button"
        variant="tertiary"
        onClick={() => setIsEditing(false)}
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
      className="border-border-gray-dark text-text-subtle w-17 border"
    >
      수정
    </Button>
  );

  return (
    <SectionCard title="프로젝트 정보" action={action}>
      {isEditing ? <ProjectInfoEditFields project={project} /> : <ProjectInfoViewFields project={project} />}
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
      {project.projectLink ? (
        <a
          href={project.projectLink}
          target="_blank"
          rel="noreferrer noopener"
          className="text-text-primary text-body-base underline"
        >
          {project.projectLink}
        </a>
      ) : (
        <span className="text-text-subtle text-body-base">-</span>
      )}
    </SectionInfoRow>
  </div>
);

const ProjectInfoEditFields = ({ project }: { project: ProjectResponse }) => {
  return (
    <div className="flex flex-col gap-8">
      <SectionInfoRow label="주최사" align="start">
        <div className="flex flex-col gap-1">
          <TextField
            name="host"
            label="주최사"
            required
            maxLength={PROJECT_FIELD_MAX_LENGTH}
            defaultValue={project.host}
            placeholder="주최사를 입력하세요"
            className="[&>label]:sr-only"
          />
          <CharCount current={project.host.length} max={PROJECT_FIELD_MAX_LENGTH} />
        </div>
      </SectionInfoRow>

      <SectionInfoRow label="프로젝트명" align="start">
        <div className="flex flex-col gap-1">
          <TextField
            name="projectName"
            label="프로젝트명"
            required
            maxLength={PROJECT_FIELD_MAX_LENGTH}
            defaultValue={project.projectName}
            placeholder="프로젝트명을 입력하세요"
            className="[&>label]:sr-only"
          />
          <CharCount current={project.projectName.length} max={PROJECT_FIELD_MAX_LENGTH} />
        </div>
      </SectionInfoRow>

      <SectionInfoRow label="날짜" align="start">
        <div className="flex items-center gap-2">
          <DatePicker defaultValue={parseDate(project.startDate)} placeholder="시작일" />
          <span className="text-text-subtle text-body-base">-</span>
          <DatePicker defaultValue={parseDate(project.endDate)} placeholder="종료일" />
        </div>
      </SectionInfoRow>

      <SectionInfoRow label="협업 인증 사진" align="start">
        <div className="flex flex-col gap-2">
          <ImageFileInput
            value={null}
            onChange={() => undefined}
            label="이미지 업로드하기"
            accept={PROJECT_IMAGE_ACCEPT}
          />
          <p className="text-body-sm text-text-subtler whitespace-pre-line">{IMAGE_GUIDE_TEXT}</p>
        </div>
      </SectionInfoRow>

      <SectionInfoRow label="URL" align="start">
        <div className="grid grid-cols-[1fr_120px] items-start gap-2">
          <TextField
            name="projectLink"
            label="URL"
            defaultValue={project.projectLink}
            placeholder="https://"
            className="[&>label]:sr-only"
          />
          <div className="flex flex-col gap-2">
            <Label className="sr-only">URL 유형</Label>
            <Select.Root defaultValue="LINK">
              <Select.Trigger aria-label="URL 유형">
                <Select.Value />
              </Select.Trigger>
              <Select.Content className="w-(--radix-select-trigger-width)">
                <Select.Item value="LINK">Link</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </SectionInfoRow>
    </div>
  );
};
