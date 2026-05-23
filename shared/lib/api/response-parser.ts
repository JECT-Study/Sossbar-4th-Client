import { ApiError, type ApiErrorData } from './error';

export type ApiResponse<T> = T | { data: T; message?: string; meta?: unknown };

export type ResponseParser = <T>(response: Response) => Promise<T>;

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

const unwrapApiResponse = <T>(response: ApiResponse<T>): T => {
  if (isWrappedApiResponse(response)) {
    return response.data;
  }
  return response;
};

export const responseParser: ResponseParser = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const json = (await safeJson(response)) as ApiErrorData | { message?: string; code?: string } | undefined;
    const message = json?.message ?? `Request failed (${response.status})`;
    const code = json && 'code' in json && typeof json.code === 'string' ? json.code : undefined;
    throw new ApiError(response.status, message, { message, code, status: response.status });
  }

  const json = (await safeJson(response)) as ApiResponse<T> | undefined;
  if (json === undefined) {
    return undefined as T;
  }

  return unwrapApiResponse(json);
};

const isWrappedApiResponse = <T>(
  response: ApiResponse<T>,
): response is { data: T; message?: string; meta?: unknown } => {
  return response !== null && typeof response === 'object' && 'data' in response;
};
