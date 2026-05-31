export const ProfileSectionSkeleton = () => (
  <section className="mt-15.5 mb-8 flex w-full flex-row">
    <div className="flex h-[104px] w-[540px] flex-row gap-6">
      <div className="bg-action-gray-light size-25 shrink-0 animate-pulse rounded-full" />
      <div className="flex flex-1 flex-col justify-center gap-3">
        <div className="bg-action-gray-light h-6 w-28 animate-pulse rounded-sm" />
        <div className="bg-action-gray-light h-4 w-44 animate-pulse rounded-sm" />
      </div>
    </div>
  </section>
);
