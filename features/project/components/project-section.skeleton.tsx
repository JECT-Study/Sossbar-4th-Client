export const ProjectSectionSkeleton = () => (
  <div aria-hidden className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }, (_, index) => (
      <div key={index} className="flex flex-col gap-4">
        <div className="bg-action-gray-light aspect-4/3 w-full animate-pulse rounded-lg" />
        <div className="bg-action-gray-light h-5 w-3/4 animate-pulse rounded-sm" />
        <div className="bg-action-gray-light h-4 w-1/2 animate-pulse rounded-sm" />
      </div>
    ))}
  </div>
);
