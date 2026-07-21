export const ProfileSectionLoading = () => (
  <section className="mb-10 flex w-full flex-col gap-6 pt-8 lg:flex-row lg:justify-between lg:gap-0">
    <div className="grid grid-cols-[60px_minmax(0,1fr)] gap-x-4 gap-y-3 lg:flex lg:flex-row lg:gap-6">
      <div className="bg-action-gray-light size-15 shrink-0 animate-pulse rounded-full lg:size-25" />
      <div className="contents lg:flex lg:flex-1 lg:flex-col lg:gap-4 lg:py-1">
        <div className="bg-action-gray-light col-start-2 row-start-1 h-8 w-40 animate-pulse self-center rounded-sm lg:col-auto lg:row-auto lg:self-auto" />
        <div className="col-span-2 flex flex-col gap-1 lg:col-auto">
          <div className="bg-action-gray-light h-4 w-20 animate-pulse rounded-sm" />
          <div className="bg-action-gray-light h-5 w-64 animate-pulse rounded-sm" />
        </div>
      </div>
    </div>
    <div className="bg-action-gray-light h-11 w-full shrink-0 animate-pulse rounded-md lg:w-44" />
  </section>
);
