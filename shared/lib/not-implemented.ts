/**
 * 백엔드 또는 API 명세가 아직 없을 때, 빈 구현 대신 호출 시 즉시 실패시키기 위한 헬퍼입니다.
 */
export const throwNotImplemented = (context: string): never => {
  throw new Error(`[미구현 API] ${context}`);
};
