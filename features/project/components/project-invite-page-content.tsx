'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { saveLoginReturnPath } from '@/features/auth/lib/login-return-path';
import { useInviteProjectMember } from '@/features/project/api/mutations';
import { useProject } from '@/features/project/api/queries';
import { parseProjectInviteId } from '@/features/project/lib/parse-project-invite-id';
import { Button } from '@/shared/components/button';
import { ConfirmationDialog } from '@/shared/components/dialog/confirmation-dialog';
import { PageContainer } from '@/shared/components/page-container';
import { useLoginModal } from '@/shared/hooks/use-login-modal';
import { ApiError } from '@/shared/lib/api';
import { useSessionUser } from '@/shared/lib/session-user';

const DEFAULT_PROJECT_IMAGE = '/default.png';

const InvalidInviteMessage = () => (
  <PageContainer className="py-20">
    <h1 className="text-heading-base text-text-basic font-bold">유효하지 않은 링크입니다</h1>
    <p className="text-body-base text-text-subtle mt-3">
      이미 종료되었거나 유효하지 않은 링크입니다. 프로젝트 방장에게 새 초대 링크를 요청해 주세요.
    </p>
    <Button asChild variant="primary" size="medium" className="mt-8">
      <Link href="/projects">프로젝트 목록으로</Link>
    </Button>
  </PageContainer>
);

export const ProjectInvitePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = useMemo(() => parseProjectInviteId(searchParams.get('projectId')), [searchParams]);
  const sessionUser = useSessionUser();
  const { openLoginModal } = useLoginModal();

  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const hasSession = sessionUser != null && sessionUser.userId > 0;
  const { data: project, isPending, isError, error } = useProject(projectId ?? 0, hasSession && projectId != null);
  const { mutateAsync: joinProject, isPending: isJoining } = useInviteProjectMember(projectId ?? 0);

  const isAlreadyMember = useMemo(() => {
    if (!project || !sessionUser) {
      return false;
    }
    return project.members.some((member) => member.userId === sessionUser.userId);
  }, [project, sessionUser]);

  const handleLogin = () => {
    saveLoginReturnPath();
    openLoginModal();
  };

  const handleJoin = useCallback(async () => {
    if (projectId == null) {
      return;
    }
    setJoinError(null);
    try {
      await joinProject();
      setJoinDialogOpen(false);
      router.push('/projects');
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setJoinError('이미 참여 중인 프로젝트입니다.');
        return;
      }
      setJoinError('프로젝트 참여에 실패했습니다. 다시 시도해 주세요.');
    }
  }, [joinProject, projectId, router]);

  if (projectId == null) {
    return <InvalidInviteMessage />;
  }

  if (!hasSession) {
    return (
      <PageContainer className="py-20">
        <h1 className="text-heading-base text-text-basic font-bold">프로젝트 초대</h1>
        <p className="text-body-base text-text-subtle mt-3">참여하려면 먼저 로그인해 주세요.</p>
        <div className="mt-8 flex gap-2">
          <Button type="button" variant="primary" size="medium" onClick={handleLogin}>
            로그인하기
          </Button>
          <Button asChild variant="tertiary" size="medium">
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (isPending) {
    return (
      <PageContainer className="py-20">
        <p className="text-body-base text-text-subtle">프로젝트 정보를 불러오는 중…</p>
      </PageContainer>
    );
  }

  if (isError || !project) {
    const isNotFound = error instanceof ApiError && error.status === 404;
    if (isNotFound) {
      return <InvalidInviteMessage />;
    }
    return (
      <PageContainer className="py-20">
        <p className="text-body-base text-text-error">프로젝트 정보를 불러오지 못했습니다.</p>
        <Button type="button" variant="tertiary" size="medium" className="mt-6" onClick={() => router.refresh()}>
          다시 시도
        </Button>
      </PageContainer>
    );
  }

  if (isAlreadyMember) {
    return (
      <PageContainer className="py-20">
        <h1 className="text-heading-base text-text-basic font-bold">이미 참여 중입니다</h1>
        <p className="text-body-base text-text-subtle mt-3">
          <span className="text-text-basic font-medium">{project.projectName}</span> 프로젝트 팀원으로 등록되어
          있습니다.
        </p>
        <Button asChild variant="primary" size="medium" className="mt-8">
          <Link href="/projects">프로젝트 목록으로</Link>
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-20">
      <div className="flex max-w-lg flex-col gap-6">
        <div className="relative aspect-4/3 w-full max-w-sm overflow-hidden rounded-2xl">
          <Image
            src={project.projectImage ?? DEFAULT_PROJECT_IMAGE}
            alt={`${project.projectName} 이미지`}
            fill
            className="object-cover"
            sizes="400px"
          />
        </div>
        <div>
          <h1 className="text-heading-base text-text-basic font-bold">{project.projectName}</h1>
          <p className="text-body-base text-text-subtle mt-2">{project.host}</p>
        </div>
        <p className="text-body-base text-text-subtle">
          <span className="text-text-basic font-medium">{project.projectName}</span> 프로젝트 후기 작성에
          참여하시겠습니까?
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="primary" size="medium" onClick={() => setJoinDialogOpen(true)}>
            참여하기
          </Button>
          <Button asChild variant="tertiary" size="medium">
            <Link href="/projects">취소</Link>
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        open={joinDialogOpen}
        title={`${project.projectName}에 참여할까요?`}
        description="참여하면 팀원 목록에 추가되며, 팀 확정 후 동료에게 후기를 작성할 수 있습니다."
        confirmText="참여하기"
        cancelText="취소"
        onOpenChange={(open) => {
          if (!open) {
            setJoinError(null);
          }
          setJoinDialogOpen(open);
        }}
        onConfirm={handleJoin}
        isConfirming={isJoining}
        errorMessage={joinError ?? undefined}
      />
    </PageContainer>
  );
};
