'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { saveLoginReturnPath } from '@/features/auth/lib/login-return-path';
import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import { useInviteProjectMember } from '@/features/project/api/mutations';
import { useProject } from '@/features/project/api/queries';
import { ProjectInviteAcceptModal } from '@/features/project/components/project-invite-accept-modal';
import { parseProjectInviteId } from '@/features/project/lib/parse-project-invite-id';
import { PROJECT_INVITE_QUERY_KEY } from '@/features/project/lib/project-invite-query';
import { ConfirmationDialog } from '@/shared/components/dialog/confirmation-dialog';
import { useLoginModal } from '@/shared/hooks/use-login-modal';
import { ApiError } from '@/shared/lib/api';

const removeInviteParamFromUrl = (pathname: string, searchParams: URLSearchParams): string => {
  const next = new URLSearchParams(searchParams.toString());
  next.delete(PROJECT_INVITE_QUERY_KEY);
  const query = next.toString();
  return query ? `${pathname}?${query}` : pathname;
};

export const ProjectInviteHandler = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: profile } = useMyProfile();
  const { openLoginModal } = useLoginModal();

  const projectId = useMemo(() => parseProjectInviteId(searchParams.get(PROJECT_INVITE_QUERY_KEY)), [searchParams]);

  const [joinError, setJoinError] = useState<string | null>(null);

  const hasSession = profile != null;

  const clearInviteParam = useCallback(() => {
    if (searchParams.get(PROJECT_INVITE_QUERY_KEY) == null) {
      return;
    }
    router.replace(removeInviteParamFromUrl(pathname, searchParams), { scroll: false });
  }, [pathname, router, searchParams]);

  const shouldFetchProject = projectId != null && hasSession;
  const { data: project, isPending, isError } = useProject(projectId ?? 0, shouldFetchProject, { throwOnError: false });
  const { mutateAsync: joinProject, isPending: isJoining } = useInviteProjectMember(projectId ?? 0);

  const isAlreadyMember = useMemo(() => {
    if (!project || !profile) {
      return false;
    }
    return project.members.some((member) => member.userId === profile.userId);
  }, [project, profile]);

  useEffect(() => {
    const raw = searchParams.get(PROJECT_INVITE_QUERY_KEY);
    if (raw != null && projectId == null) {
      clearInviteParam();
    }
  }, [clearInviteParam, projectId, searchParams]);

  useEffect(() => {
    if (projectId == null || hasSession) {
      return;
    }
    saveLoginReturnPath();
    openLoginModal();
  }, [hasSession, openLoginModal, projectId]);

  useEffect(() => {
    if (!shouldFetchProject || isPending || !project) {
      return;
    }
    if (isAlreadyMember) {
      clearInviteParam();
    }
  }, [clearInviteParam, isAlreadyMember, isPending, project, shouldFetchProject]);

  const acceptModalOpen =
    projectId != null && hasSession && !isPending && !isError && project != null && !isAlreadyMember;

  const invalidInviteModalOpen = projectId != null && hasSession && shouldFetchProject && !isPending && isError;

  const handleAcceptOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setJoinError(null);
        clearInviteParam();
      }
    },
    [clearInviteParam],
  );

  const handleJoin = useCallback(async () => {
    if (projectId == null) {
      return;
    }
    setJoinError(null);
    try {
      await joinProject();
      clearInviteParam();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setJoinError('이미 참여 중인 프로젝트입니다.');
        return;
      }
      setJoinError('프로젝트 참여에 실패했습니다. 다시 시도해 주세요.');
    }
  }, [clearInviteParam, joinProject, projectId]);

  const handleInvalidOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        clearInviteParam();
      }
    },
    [clearInviteParam],
  );

  if (projectId == null) {
    return null;
  }

  return (
    <>
      {project ? (
        <ProjectInviteAcceptModal
          open={acceptModalOpen}
          projectName={project.projectName}
          onOpenChange={handleAcceptOpenChange}
          onConfirm={handleJoin}
          isConfirming={isJoining}
          errorMessage={joinError ?? undefined}
        />
      ) : null}
      <ConfirmationDialog
        open={invalidInviteModalOpen}
        title="유효하지 않은 링크입니다"
        description="이미 종료되었거나 유효하지 않은 링크입니다. 프로젝트 방장에게 새 초대 링크를 요청해 주세요."
        confirmText="확인"
        cancelText="닫기"
        onOpenChange={handleInvalidOpenChange}
        onConfirm={() => handleInvalidOpenChange(false)}
      />
    </>
  );
};
