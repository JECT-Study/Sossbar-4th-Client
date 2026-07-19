const CardSkeleton = () => (
  <div className="border-border-gray bg-surface-white flex justify-between rounded-xl border p-5 lg:rounded-2xl lg:p-8">
    <div className="flex flex-1 flex-col gap-6 lg:gap-8">
      <div className="bg-surface-gray-subtle h-7 w-32 animate-pulse rounded" />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 lg:flex-row lg:gap-[60px]">
          <div className="bg-surface-gray-subtle h-5 w-30 shrink-0 animate-pulse rounded" />
          <div className="bg-surface-gray-subtler h-5 w-64 animate-pulse rounded" />
        </div>
        <div className="flex flex-col gap-2 lg:flex-row lg:gap-[60px]">
          <div className="bg-surface-gray-subtle h-5 w-30 shrink-0 animate-pulse rounded" />
          <div className="bg-surface-gray-subtler h-5 w-48 animate-pulse rounded" />
        </div>
      </div>
    </div>
    <div className="bg-surface-gray-subtle h-11 w-24 shrink-0 animate-pulse rounded-[6px]" />
  </div>
);

export const MypageSkeleton = () => (
  <div
    className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 lg:gap-[30px]"
    role="status"
    aria-label="마이페이지 정보를 불러오는 중"
    aria-busy="true"
  >
    <div className="lg:border-border-gray-light flex flex-col gap-2 pt-8 pb-4 lg:border-b-[3px] lg:pt-[62px] lg:pb-8">
      <div className="bg-surface-gray-subtle h-9 w-40 animate-pulse rounded" />
      <div className="bg-surface-gray-subtler h-5 w-80 animate-pulse rounded" />
    </div>
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <span className="sr-only">로딩 중...</span>
  </div>
);
