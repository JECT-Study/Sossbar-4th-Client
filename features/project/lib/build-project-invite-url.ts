import { PROJECT_INVITE_QUERY_KEY } from './project-invite-query';

const getSiteOrigin = (): string => {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  return '';
};

/** 초대 링크 — 프로젝트 관리 화면에서 수락 모달을 띄우는 쿼리 URL */
export const buildProjectInviteUrl = (projectId: number): string => {
  const path = `/projects?${PROJECT_INVITE_QUERY_KEY}=${projectId}`;
  const origin = getSiteOrigin();

  return origin ? `${origin}${path}` : path;
};
