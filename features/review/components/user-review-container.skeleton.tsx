export const UserReviewContainerSkeleton = () => (
  <section aria-hidden className="border-border-gray flex h-136 w-full flex-col rounded-2xl border bg-white p-6">
    <div className="flex items-center justify-between">
      <div className="bg-action-gray-light h-6 w-24 animate-pulse rounded-sm" />
      <div className="bg-action-gray-light h-10 w-48 animate-pulse rounded-md" />
    </div>
    <div className="mt-8 flex flex-col gap-4">
      <div className="bg-action-gray-light h-24 w-full animate-pulse rounded-md" />
      <div className="bg-action-gray-light h-24 w-full animate-pulse rounded-md" />
    </div>
  </section>
);
