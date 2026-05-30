import type { ProjectMemberResponse } from '@/features/project/types';

const spectrumSubmittedKey = (projectId: number) => `sossbar:spectrum-submitted:${projectId}`;

export const markProjectSpectrumSubmitted = (projectId: number): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    sessionStorage.setItem(spectrumSubmittedKey(projectId), '1');
  } catch {
    // private mode / quota
  }
};

const isProjectSpectrumMarkedSubmitted = (projectId: number): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    return sessionStorage.getItem(spectrumSubmittedKey(projectId)) === '1';
  } catch {
    return false;
  }
};

/** 이 프로젝트에서 내가 이미 한 명 이상에게 후기를 썼는지 (스펙트럼은 첫 후기에만 저장) */
export const hasSubmittedReviewInProject = (
  members: readonly ProjectMemberResponse[] | undefined,
  sessionUserId: number,
): boolean => members?.some((member) => member.userId !== sessionUserId && member.reviewWritten === true) ?? false;

export const hasSubmittedProjectSpectrum = (
  projectId: number,
  members: readonly ProjectMemberResponse[] | undefined,
  sessionUserId: number,
): boolean => isProjectSpectrumMarkedSubmitted(projectId) || hasSubmittedReviewInProject(members, sessionUserId);

export const hasWrittenReviewForMember = (
  members: readonly ProjectMemberResponse[] | undefined,
  revieweeUserId: number,
): boolean => members?.some((member) => member.userId === revieweeUserId && member.reviewWritten === true) ?? false;
