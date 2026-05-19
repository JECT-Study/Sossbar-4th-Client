import { getAccessToken } from './access-token';
import { ApiError, type ApiErrorData } from './api-error';
import { unwrapApiResponse, type ApiResponse } from './api-response';
import { buildApiUrl, getApiOrigin } from './resolve-api-url';

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** defaults to `/api/v1` */
  basePath?: string;
};

export const DEFAULT_API_BASE_PATH = '/api/v1';

/** 본문이 반드시 있어야 하는 성공 응답용 — `undefined`면 예외 */
export const assertApiData = <T>(value: T | undefined): T => {
  if (value === undefined) {
    throw new ApiError(502, 'Empty response body');
  }
  return value;
};

/** When `fetch` throws (network / DNS / aborted, etc.). Surfaced as `ApiError` like HTTP failures—often handled alongside 5xx. */
const FETCH_FAILURE_STATUS = 503;

const safeJson = async (res: Response): Promise<unknown | undefined> => {
  const text = await res.text();
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
};

export const apiRequest = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T | undefined> => {
  const { basePath = DEFAULT_API_BASE_PATH, headers, body, ...init } = options;

  let res: Response;
  try {
    const url = buildApiUrl(basePath, path);
    const token = getAccessToken();

    const requestHeaders = new Headers(headers);
    if (body !== undefined) {
      requestHeaders.set('Content-Type', 'application/json');
    }
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    res = await fetch(url, {
      ...init,
      credentials: init.credentials ?? (getApiOrigin() ? 'include' : 'same-origin'),
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network request failed';
    throw new ApiError(FETCH_FAILURE_STATUS, message);
  }

  if (!res.ok) {
    const errorData = (await safeJson(res)) as ApiErrorData | undefined;
    const message = errorData?.message ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, message, errorData);
  }

  if (res.status === 204 || res.status === 205) {
    return undefined;
  }

  const raw = await safeJson(res);
  if (raw === undefined) {
    return undefined;
  }

  return unwrapApiResponse(raw as ApiResponse<T>);
};
