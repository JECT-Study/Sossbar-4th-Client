import { ApiError, type ApiErrorData } from './api-error';
import { unwrapApiResponse, type ApiResponse } from './api-response';

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** defaults to `/api/v1` */
  basePath?: string;
};

const DEFAULT_BASE_PATH = '/api/v1';

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

export const apiRequest = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { basePath = DEFAULT_BASE_PATH, headers, body, ...init } = options;

  let res: Response;
  try {https://github.com/JECT-Study/Sossbar-4th-Client/pull/75/conflict?name=shared%252Flib%252Fapi%252Findex.ts&base_oid=682dd848d7e54665d9917220d32c48d082017849&head_oid=c33072a4d23ced62f0d9247481d3e9fe16d0c5cd
    res = await fetch(`${basePath}${path}`, {
      ...init,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : null),
        ...headers,
      },
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

  const json = (await safeJson(res)) as ApiResponse<T> | undefined;
  if (json === undefined) {
    // 204 / empty body
    return undefined as T;
  }
  return unwrapApiResponse(json);
};
