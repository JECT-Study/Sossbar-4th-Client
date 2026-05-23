import { getAuthToken } from '@/shared/lib/auth-token';

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  basePath?: string;
};

export type RequestBuilder = (path: string, options: ApiRequestOptions) => Request;

const DEFAULT_BASE_PATH = '/api/v1';

export const requestBuilder: RequestBuilder = (path, { basePath = DEFAULT_BASE_PATH, headers, body, ...init }) => {
  const hasBody = body !== undefined;
  const isFormData = body instanceof FormData;
  const token = getAuthToken()?.accessToken;

  return new Request(`${basePath}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(hasBody && !isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: hasBody ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });
};
