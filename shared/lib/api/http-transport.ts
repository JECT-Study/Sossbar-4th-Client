import { ApiError } from './error';

/**
 * `Request`를 실행하고 `Response`를 반환하는 역할.
 * 네트워크 수준의 오류(DNS 실패, 타임아웃, 연결 거부)를 `ApiError`로 변환한다.
 *
 * @param request - 전송할 `Request` 객체
 * @returns 서버 응답 `Response`
 * @throws {ApiError} status 503 — 네트워크 장애 시
 */
export type HttpTransport = (request: Request) => Promise<Response>;

const FETCH_FAILURE_STATUS = 503;

export const httpTransport: HttpTransport = async (request) => {
  try {
    return await fetch(request);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '일시적으로 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.';
    throw new ApiError(FETCH_FAILURE_STATUS, message);
  }
};
