'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { saveLoginReturnPath, useLoginGate } from '@/features/auth';
import { useMyProfile } from '@/features/profile';
import { ProjectInviteAcceptModal } from '@/features/project/components/project-invite-accept-modal';
import { ConfirmationDialog } from '@/shared/components/dialog/confirmation-dialog';
import { SHARE_INVITER_NAME_PARAM } from '@/shared/constants/share-query';
import { ApiError } from '@/shared/lib/api';
import { parseShareDisplayName } from '@/shared/lib/parse-share-display-name';

import type { ProjectPositionValue } from '../project.types';

import { useInviteProjectMember } from '../project.hooks';
import { parseProjectInviteLink, PROJECT_INVITE_QUERY_KEY } from '../project.lib';

/** 초대 링크 자체가 유효하지 않을 때(만료/삭제) 백엔드가 내려주는 상태 코드 */
const INVALID_INVITE_STATUSES = new Set([400, 404, 410]);

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
  const { openLogin } = useLoginGate();

  const projectLink = useMemo(() => parseProjectInviteLink(searchParams.get(PROJECT_INVITE_QUERY_KEY)), [searchParams]);

  const [joinError, setJoinError] = useState<string | null>(null);
  const [invalidLink, setInvalidLink] = useState(false);

  const hasSession = profile != null;

  const inviterName = useMemo(
    () => parseShareDisplayName(searchParams.get(SHARE_INVITER_NAME_PARAM) ?? undefined) ?? '',
    [searchParams],
  );

  const clearInviteParam = useCallback(() => {
    if (searchParams.get(PROJECT_INVITE_QUERY_KEY) == null) {
      return;
    }
    router.replace(removeInviteParamFromUrl(pathname, searchParams), { scroll: false });
  }, [pathname, router, searchParams]);

  const { mutateAsync: joinProject, isPending: isJoining } = useInviteProjectMember(projectLink ?? '');

  useEffect(() => {
    const raw = searchParams.get(PROJECT_INVITE_QUERY_KEY);
    if (raw != null && projectLink == null) {
      clearInviteParam();
    }
  }, [clearInviteParam, projectLink, searchParams]);

  useEffect(() => {
    if (projectLink == null || hasSession) {
      return;
    }
    saveLoginReturnPath();
    openLogin();
  }, [hasSession, openLogin, projectLink]);

  // POST 성공 전까지는 프로젝트 정보를 알 수 없으므로 링크·세션만으로 수락 모달을 연다.
  const acceptModalOpen = projectLink != null && hasSession && !invalidLink;

  const handleAcceptOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setJoinError(null);
        clearInviteParam();
      }
    },
    [clearInviteParam],
  );

  const handleJoin = useCallback(
    async (projectPositions: ProjectPositionValue[]) => {
      if (projectLink == null) {
        return;
      }
      setJoinError(null);
      try {
        await joinProject(projectPositions);
        clearInviteParam();
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 409) {
            setJoinError('이미 참여 중인 프로젝트입니다.');
            return;
          }
          if (INVALID_INVITE_STATUSES.has(err.status)) {
            setInvalidLink(true);
            return;
          }
        }
        setJoinError('프로젝트 참여에 실패했습니다. 다시 시도해 주세요.');
      }
    },
    [clearInviteParam, joinProject, projectLink],
  );

  const handleInvalidOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setInvalidLink(false);
        clearInviteParam();
      }
    },
    [clearInviteParam],
  );

  if (projectLink == null) {
    return null;
  }

  return (
    <>
      <ProjectInviteAcceptModal
        key={projectLink}
        open={acceptModalOpen}
        inviterName={inviterName}
        onOpenChange={handleAcceptOpenChange}
        onConfirm={handleJoin}
        isConfirming={isJoining}
        errorMessage={joinError ?? undefined}
      />
      <ConfirmationDialog
        open={invalidLink}
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
