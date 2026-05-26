export const MyPageSkeleton = () => (
  <div
    className="mx-auto flex w-full max-w-[480px] flex-col gap-10 py-20"
    role="status"
    aria-label="마이페이지 정보를 불러오는 중"
    aria-busy="true"
  >
    <div className="flex flex-col gap-8">
      <div className="bg-surface-gray-subtle h-6 w-24 animate-pulse rounded" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="bg-surface-gray-subtle h-5 w-10 animate-pulse rounded" />
          <div className="bg-surface-gray-subtler h-13 w-full animate-pulse rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-surface-gray-subtle h-5 w-18 animate-pulse rounded" />
          <div className="bg-surface-gray-subtler h-13 w-full animate-pulse rounded-md" />
        </div>
      </div>
    </div>

    <div className="w-full">
      <div className="bg-surface-gray-subtle mb-8 h-6 w-24 animate-pulse rounded" />
      <div className="flex items-center gap-2">
        <div className="bg-surface-gray-subtler size-5 animate-pulse rounded" />
        <div className="bg-surface-gray-subtler h-5 flex-1 animate-pulse rounded" />
      </div>
    </div>

    <div className="flex w-full flex-col gap-4">
      <div className="bg-surface-gray-subtle h-14 w-full animate-pulse rounded-md" />
      <div className="bg-surface-gray-subtler h-14 w-full animate-pulse rounded-md" />
    </div>
    <span className="sr-only">로딩 중...</span>
  </div>
);
