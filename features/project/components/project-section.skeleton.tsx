export const ProjectSectionSkeleton = () => (
  <div aria-hidden className="border-border-gray overflow-hidden rounded-2xl border">
    <div className="bg-surface-gray-subtler border-border-gray flex h-[65px] items-center justify-end border-b px-6 py-5">
      <div className="bg-action-gray-light h-4 w-28 animate-pulse rounded-sm" />
    </div>
    <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-4 lg:gap-6 lg:p-6">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="flex flex-col gap-4 pb-4">
          <div className="bg-action-gray-light aspect-[72/54] w-full animate-pulse rounded-lg" />
          <div className="flex flex-col gap-1">
            <div className="bg-action-gray-light h-5 w-3/4 animate-pulse rounded-sm" />
            <div className="bg-action-gray-light h-3 w-1/2 animate-pulse rounded-sm" />
            <div className="bg-action-gray-light h-3 w-1/3 animate-pulse rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
