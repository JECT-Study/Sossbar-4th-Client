import { getAuthToken, setAuthToken, clearAuthToken } from '@/shared/lib/auth-token';

import { ApiError } from './error';

/**
 * `Request`를 실행하고 `Response`를 반환하는 역할.
 * 네트워크 수준의 오류(DNS 실패, 타임아웃, 연결 거부)를 `ApiError`로 변환한다.
 * JWT-001(만료) 응답 시 refreshToken으로 재발급 후 1회 재시도한다.
 *
 * @param request - 전송할 `Request` 객체
 * @returns 서버 응답 `Response`
 * @throws {ApiError} status 503 — 네트워크 장애 시
 */
export type HttpTransport = (request: Request) => Promise<Response>;

const FETCH_FAILURE_STATUS = 503;

type ReissueResponseBody = { data: { accessToken: string; userId: number } };

const tryReissueToken = async (): Promise<string | null> => {
  try {
    const res = await fetch('/api/v1/login/reissue', {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      return null;
    }
    const json = (await res.json()) as ReissueResponseBody;
    const newToken = json.data;
    const currentUserId = getAuthToken()?.userId ?? newToken.userId;
    setAuthToken({ accessToken: newToken.accessToken, userId: currentUserId });
    return newToken.accessToken;
  } catch {
    return null;
  }
};

export const httpTransport: HttpTransport = async (request) => {
  // 재시도를 위해 fetch 전에 미리 클론
  const clonedRequest = request.clone();

  try {
    const response = await fetch(request);

    if (response.status === 401) {
      const errorBody = (await response
        .clone()
        .json()
        .catch(() => null)) as { code?: string } | null;

      if (errorBody?.code === 'JWT-001') {
        const newToken = await tryReissueToken();
        if (newToken) {
          const retryHeaders = new Headers(clonedRequest.headers);
          retryHeaders.set('Authorization', `Bearer ${newToken}`);
          return await fetch(new Request(clonedRequest, { headers: retryHeaders }));
        }
      }

      clearAuthToken();
    }

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '일시적으로 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.';
    throw new ApiError(FETCH_FAILURE_STATUS, message);
  }
};
