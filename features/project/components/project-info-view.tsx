import Image from 'next/image';

import { SectionInfoRow } from '@/shared/components/section-card';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

import type { ProjectResponse } from '../project.types';

const DEFAULT_PROJECT_IMAGE = '/default.png';

interface Props {
  project: ProjectResponse;
}

const formatDateRange = (startDate: string | null, endDate: string | null): string => {
  if (!startDate && !endDate) {
    return '-';
  }
  const start = startDate ? formatIsoDateToDots(startDate) : '';
  const end = endDate ? formatIsoDateToDots(endDate) : '';
  return `${start} - ${end}`;
};

export const ProjectInfoView = ({ project }: Props) => {
  return (
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
};
