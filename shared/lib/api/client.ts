import { ApiError, type ApiErrorPayload, unwrapApiResponse, type ApiResponse } from './types';

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** defaults to `/api/v1` */
  basePath?: string;
};

const DEFAULT_BASE_PATH = '/api/v1';

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

export const apiRequest = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { basePath = DEFAULT_BASE_PATH, headers, body, ...init } = options;

  const res = await fetch(`${basePath}${path}`, {
    ...init,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : null),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const payload = (await safeJson(res)) as ApiErrorPayload | undefined;
    const message = payload?.message ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, message, payload);
  }

  const json = (await safeJson(res)) as ApiResponse<T> | undefined;
  if (json === undefined) {
    // 204 / empty body
    return undefined as T;
  }
  return unwrapApiResponse(json);
};
