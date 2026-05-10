import { getAccessToken } from './access-token';
import { buildApiUrl } from './resolve-api-url';
import { ApiError, type ApiErrorPayload, type ApiResponse, unwrapApiResponse } from './types';

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
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

  const url = buildApiUrl(basePath, path);
  const token = getAccessToken();

  const requestHeaders = new Headers(headers);
  if (body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...init,
    credentials: init.credentials ?? 'same-origin',
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const payload = (await safeJson(res)) as ApiErrorPayload | undefined;
    const message = payload?.message ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, message, payload);
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
