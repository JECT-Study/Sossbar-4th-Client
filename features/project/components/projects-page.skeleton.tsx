import { PageContainer } from '@/shared/components/page-container';

import { ProjectListLoading } from './project-list-loading';

export const ProjectsPageSkeleton = () => (
  <div aria-hidden>
    <PageContainer>
      <div className="border-border-gray-light mt-15.5 flex flex-row items-start justify-between border-b-[3px] pb-8">
        <div className="flex flex-col gap-2">
          <div className="bg-action-gray-light h-9 w-56 animate-pulse rounded-md" />
          <div className="bg-action-gray-light h-6 w-80 animate-pulse rounded-sm" />
        </div>
        <div className="bg-action-gray-light h-11 w-44 animate-pulse rounded-md" />
      </div>

      <section className="border-border-gray mt-[30px] mb-20 overflow-hidden rounded-2xl border">
        <div className="bg-surface-gray-subtle border-border-gray flex h-16 items-center justify-end border-b px-8">
          <div className="flex items-center gap-2">
            <div className="bg-action-gray-light h-6 w-24 animate-pulse rounded-md" />
            <div className="bg-action-gray-light h-6 w-24 animate-pulse rounded-md" />
          </div>
        </div>
        <div className="p-8">
          <ProjectListLoading />
        </div>
      </section>
    </PageContainer>
  </div>
);
