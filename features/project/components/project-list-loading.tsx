const SKELETON_CARD_COUNT = 3;

const ProjectListCardSkeleton = () => (
  <article className="border-border-gray-light bg-surface-white flex flex-row gap-6 rounded-2xl border p-6">
    <div className="bg-action-gray-light h-[214px] w-[286px] shrink-0 animate-pulse rounded-2xl" />

    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <div className="flex h-8 flex-row items-center justify-between">
        <div className="bg-action-gray-light h-6 w-24 animate-pulse rounded-full" />
        <div className="bg-action-gray-light h-5 w-20 animate-pulse rounded-sm" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-action-gray-light h-6 w-1/2 animate-pulse rounded-sm" />
        <div className="bg-action-gray-light h-4 w-1/3 animate-pulse rounded-sm" />
      </div>
      <div className="bg-action-gray-light h-10 w-full animate-pulse rounded-lg" />
      <div className="flex gap-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="bg-action-gray-light h-9 w-24 animate-pulse rounded-full" />
        ))}
      </div>
    </div>
  </article>
);

export const ProjectListLoading = () => (
  <div aria-busy="true" aria-label="프로젝트 목록을 불러오는 중" className="flex flex-col gap-6">
    {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
      <ProjectListCardSkeleton key={index} />
    ))}
    <span className="sr-only">로딩 중...</span>
  </div>
);
