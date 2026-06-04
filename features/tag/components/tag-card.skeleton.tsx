import { cn } from '@/shared/lib/cn';

const SkeletonLine = ({ className }: { className?: string }) => (
  <div className={cn('bg-action-gray-light animate-pulse rounded-sm', className)} />
);

const SkeletonBadge = ({ className }: { className?: string }) => (
  <div className={cn('bg-action-gray-light h-9 shrink-0 animate-pulse rounded-full', className)} />
);

const TOP3_BADGE_WIDTHS = ['w-52', 'w-44', 'w-40'] as const;

const ALL_TAG_BADGE_SKELETONS = [
  { id: 'tag-a', width: 'w-28' },
  { id: 'tag-b', width: 'w-36' },
  { id: 'tag-c', width: 'w-24' },
  { id: 'tag-d', width: 'w-32' },
  { id: 'tag-e', width: 'w-20' },
  { id: 'tag-f', width: 'w-40' },
  { id: 'tag-g', width: 'w-28' },
  { id: 'tag-h', width: 'w-24' },
  { id: 'tag-i', width: 'w-36' },
  { id: 'tag-j', width: 'w-32' },
] as const;

export const TagCardSkeleton = () => (
  <section
    aria-busy="true"
    aria-label="받은 태그를 불러오는 중"
    className="border-border-gray flex h-[652px] w-[588px] flex-col overflow-hidden rounded-2xl border bg-white p-6"
  >
    <SkeletonLine className="h-6 w-24" />

    <div className="mt-6 flex min-h-0 flex-1 flex-col gap-6">
      <div>
        <SkeletonLine className="h-5 w-32" />
        <div className="mt-4 flex flex-col items-start gap-2">
          {TOP3_BADGE_WIDTHS.map((width) => (
            <SkeletonBadge key={width} className={width} />
          ))}
        </div>
      </div>

      <div>
        <SkeletonLine className="h-5 w-44" />
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_TAG_BADGE_SKELETONS.map(({ id, width }) => (
            <SkeletonBadge key={id} className={width} />
          ))}
        </div>
      </div>
    </div>

    <span className="sr-only">로딩 중...</span>
  </section>
);
