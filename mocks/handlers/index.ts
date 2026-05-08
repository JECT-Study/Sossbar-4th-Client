import { authHandlers } from './auth';

/**
 * 로그인 목만 활성화 (MSW 작업 브랜치).
 * 다른 도메인 핸들러는 필요 시 `users`, `projects` 등을 다시 합치면 됩니다.
 */
export const handlers = [...authHandlers];
