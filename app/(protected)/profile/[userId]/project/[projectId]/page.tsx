import { dehydrate} from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { fetchMyProfile } from '@/features/profile/api/fetch-my-profile';
import { profileKeys } from '@/features/profile/profile.query-keys';
import { fetchProject } from '@/features/project/api/fetchers';
import { projectKeys } from '@/features/project/api/query-keys';
import { ProjectDetailStream } from '@/features/project/components/project-detail-stream';
import { getQueryClient } from '@/shared/lib/get-query-client';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';

interface Props = {
  params: Promise<{
    userId: string;
    projectId: string;
  }>;
}

const ProjectPage = async ({ params }: Props) => {
  const { userId, projectId } = await params;
  const queryClient = getQueryClient();

const queryClient = getQueryClient();
const cookieStore = awaitcookies();
const cookieHeader = { Cookie: cookieStore.toString() };  

try {
      await
  queryClient.fetchQuery({   
        queryKey: projectKeys
  .detail(projectIdNum),     
        queryFn: () =>       
  fetchProject(projectIdNum, 
  { headers: cookieHeader }),
      });
    } catch {
      return notFound();     
    }

await
  queryClient.prefetchQuery({ queryKey: profileKeys.my,queryFn: () =>
  fetchMyProfile({ headers:  
  cookieHeader }),
    });

 return
  <ProjectDetailStream       
  userId={profileUserId}     
  projectId={projectIdNum}   
  state={dehydrate(queryClient)} />;
};

export default ProjectPage;
