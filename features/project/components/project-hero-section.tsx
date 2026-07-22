import Image from 'next/image';
import Link from 'next/link';

import { POSITION_BADGE_MAP } from '@/features/profile';
import { ArrowLeftIcon, LinkIcon } from '@/shared/assets/icons';
import { Badge } from '@/shared/components/badge';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

import type { ProjectPositionValue } from '../project.types';

const DEFAULT_PROJECT_IMAGE = '/default.png';

interface Props {
  projectName: string;
  projectImage: string | null;
  host: string;
  startDate: string | null;
  projectPositions?: ProjectPositionValue[];
  projectUrl?: string;
  backHref?: string;
}

export const ProjectHeroSection = ({
  projectName,
  projectImage,
  host,
  startDate,
  projectPositions,
  projectUrl,
  backHref,
}: Props) => {
  const positions = projectPositions ?? [];
  const metaParts = [host, startDate ? formatIsoDateToDots(startDate) : null].filter((part): part is string =>
    Boolean(part),
  );

  return (
    <section className="border-border-gray-light flex w-full flex-col border-b lg:flex-row lg:gap-6 lg:border-b-[3px] lg:pb-8">
      <div className="border-border-gray-light relative -mx-4 h-[220px] overflow-hidden sm:-mx-6 lg:mx-0 lg:h-[106px] lg:w-[142px] lg:shrink-0 lg:rounded-2xl lg:border">
        <Image
          src={projectImage ?? DEFAULT_PROJECT_IMAGE}
          alt={`${projectName} 이미지`}
          fill
          sizes="(min-width: 1024px) 142px, 100vw"
          className="object-cover"
        />
        {backHref ? (
          <Link
            href={backHref}
            aria-label="뒤로가기"
            className="absolute top-3 left-3 flex size-9 items-center justify-center rounded-full bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.15)] lg:hidden"
          >
            <ArrowLeftIcon aria-hidden className="size-6" />
          </Link>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col gap-2 py-5 lg:py-0">
        <h1 className="text-body-lg lg:text-heading-lg text-text-basic font-bold">{projectName}</h1>
        {positions.length > 0 || metaParts.length > 0 ? (
          <div className="text-detail-xs lg:text-body-base text-text-subtle flex flex-wrap items-center gap-2 font-medium lg:font-normal">
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
            className="text-detail-sm lg:text-body-base text-text-subtle hover:text-text-basic inline-flex w-full max-w-full items-center gap-1 lg:w-fit"
          >
            <LinkIcon aria-hidden className="size-5 shrink-0 lg:size-4" />
            <span className="truncate underline">{projectUrl}</span>
          </a>
        ) : null}
      </div>
    </section>
  );
};
