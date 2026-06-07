import { ProjectDetailStream } from '@/features/project/components/project-detail-stream';

type ProjectPageProps = {
  params: Promise<{
    userId: string;
    projectId: string;
  }>;
};

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const { userId, projectId } = await params;

  return <ProjectDetailStream userId={Number(userId)} projectId={Number(projectId)} />;
};

export default ProjectPage;
