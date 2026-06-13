import { getQueryClient } from '@/shared/lib/get-query-client';

import { ApiError, type ApiErrorData } from './error';

export type ApiRequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

// 서버에서는 Next.js 프록시 rewrite를 거치지 않으므로 백엔드로 직접 절대 URL 사용
const API_BASE =
  typeof window === 'undefined'
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.sossbar.com'}/api/v1`
    : '/api/v1';

const tryReissueToken = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/login/reissue`, { method: 'POST', credentials: 'same-origin' });
    return res.ok;
  } catch {
    return false;
  }
};

const parseResponse = async <T>(res: Response): Promise<T> => {
  let json: unknown;
  try {
    const text = await res.text();
    json = text ? JSON.parse(text) : undefined;
  } catch {
    json = undefined;
  }

  if (!res.ok) {
    const data = json as ApiErrorData | undefined;
    throw new ApiError(res.status, data?.message ?? `Request failed (${res.status})`, data);
  }

  if (json === undefined) {
    return undefined as T;
  }
  if (json !== null && typeof json === 'object' && 'data' in json) {
    return (json as { data: T }).data;
  }
  return json as T;
};

export const apiRequest = async <T>(path: string, { body, headers, ...init }: ApiRequestOptions = {}): Promise<T> => {
  const isFormData = body instanceof FormData;

  const buildRequest = () =>
    new Request(`${API_BASE}${path}`, {
      ...init,
      credentials: 'same-origin',
      headers: {
        // FormData는 브라우저가 Content-Type + boundary를 자동 설정하므로 명시하지 않음
        ...(!isFormData && body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });

  let res: Response;
  try {
    res = await fetch(buildRequest());
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '일시적으로 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.';
    throw new ApiError(503, message);
  }

  if (res.status === 401) {
    const errorBody = (await res
      .clone()
      .json()
      .catch(() => null)) as { code?: string } | null;

    if (errorBody?.code === 'JWT-001') {
      const reissued = await tryReissueToken();
      if (reissued) {
        return parseResponse<T>(await fetch(buildRequest()));
      }
      // 토큰 만료 후 재발급도 실패한 경우에만 캐시 초기화
      getQueryClient().clear();
    }
  }

  return parseResponse<T>(res);
};
