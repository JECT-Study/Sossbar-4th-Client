export const ProfileSectionSkeleton = () => (
  <section className="mb-10 flex w-full flex-row justify-between pt-8">
    <div className="flex flex-row gap-6">
      <div className="bg-action-gray-light size-25 shrink-0 animate-pulse rounded-full" />
      <div className="flex flex-1 flex-col gap-4 py-1">
        <div className="bg-action-gray-light h-8 w-40 animate-pulse rounded-sm" />
        <div className="flex flex-col gap-1">
          <div className="bg-action-gray-light h-4 w-20 animate-pulse rounded-sm" />
          <div className="bg-action-gray-light h-5 w-64 animate-pulse rounded-sm" />
        </div>
      </div>
    </div>
    <div className="bg-action-gray-light h-11 w-44 shrink-0 animate-pulse rounded-md" />
  </section>
);
