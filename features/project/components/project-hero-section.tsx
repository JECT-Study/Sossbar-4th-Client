import type { ComponentType, SVGProps } from 'react';

import Image from 'next/image';

import {
  BackendIcon,
  FrontendIcon,
  OpenNewWindowIcon,
  ProductDesignerIcon,
  ProductManagerIcon,
} from '@/shared/assets/icons';
import { Badge } from '@/shared/components/badge';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

import type { ProjectPositionValue } from '../project.types';

const DEFAULT_PROJECT_IMAGE = '/default.png';

const POSITION_BADGE_MAP: Record<
  ProjectPositionValue,
  { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  FE: { label: '프론트엔드', Icon: FrontendIcon },
  BE: { label: '백엔드', Icon: BackendIcon },
  PM: { label: '프로덕트 매니저', Icon: ProductManagerIcon },
  PD: { label: '프로덕트 디자이너', Icon: ProductDesignerIcon },
};

interface Props {
  projectName: string;
  projectImage: string | null;
  host: string;
  startDate: string | null;
  projectPositions?: ProjectPositionValue[];
  projectUrl?: string;
}

export const ProjectHeroSection = ({
  projectName,
  projectImage,
  host,
  startDate,
  projectPositions,
  projectUrl,
}: Props) => {
  const positions = projectPositions ?? [];
  const metaParts = [host, startDate ? formatIsoDateToDots(startDate) : null].filter((part): part is string =>
    Boolean(part),
  );

  return (
    <section className="border-border-gray-light flex w-full gap-6 border-b-[3px] pb-8">
      <div className="border-border-gray-light relative h-[106px] w-[142px] shrink-0 overflow-hidden rounded-2xl border">
        <Image
          src={projectImage ?? DEFAULT_PROJECT_IMAGE}
          alt={`${projectName} 이미지`}
          fill
          sizes="142px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-lg text-text-basic font-bold">{projectName}</h1>
        {positions.length > 0 || metaParts.length > 0 ? (
          <div className="text-body-base text-text-subtle flex flex-wrap items-center gap-2 font-normal">
            {positions.map((position) => {
              const { label, Icon } = POSITION_BADGE_MAP[position];
              return (
                <Badge key={position} icon={<Icon />}>
                  {label}
                </Badge>
              );
            })}
            {metaParts.map((part, index) => (
              <span key={part} className="flex items-center gap-2">
                {index === 0 && positions.length > 0 ? <span aria-hidden>·</span> : null}
                {index > 0 ? <span aria-hidden>·</span> : null}
                <span>{part}</span>
              </span>
            ))}
          </div>
        ) : null}
        {projectUrl ? (
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-base text-text-subtle hover:text-text-basic inline-flex w-fit items-center gap-1"
          >
            <OpenNewWindowIcon aria-hidden className="size-4 shrink-0" />
            <span className="underline">{projectUrl}</span>
          </a>
        ) : null}
      </div>
    </section>
  );
};
