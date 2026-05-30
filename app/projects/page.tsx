import { Suspense } from 'react';

import { ProjectsPageContent } from '@/features/project/components/projects-page-content';

const ProjectsPageFallback = () => (
  <div className="flex min-h-[240px] items-center justify-center">
    <p className="text-body-base text-text-subtle">화면을 불러오는 중…</p>
  </div>
);

const ProjectsPage = () => (
  <Suspense fallback={<ProjectsPageFallback />}>
    <ProjectsPageContent />
  </Suspense>
);

export default ProjectsPage;
