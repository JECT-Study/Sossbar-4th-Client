import { getAuthToken } from '@/shared/lib/auth-token';

import { buildApiUrl, getApiOrigin } from './resolve-api-url';

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  basePath?: string;
};

export type RequestBuilder = (path: string, options: ApiRequestOptions) => Request;

const DEFAULT_BASE_PATH = '/api/v1';

export const requestBuilder: RequestBuilder = (path, { basePath = DEFAULT_BASE_PATH, headers, body, ...init }) => {
  const hasBody = body !== undefined;
  const isFormDataBody = typeof FormData !== 'undefined' && body instanceof FormData;
  const url = buildApiUrl(basePath, path);
  const apiOrigin = getApiOrigin();
  const token = getAuthToken()?.accessToken;

  return new Request(url, {
    ...init,
    credentials: init.credentials ?? (apiOrigin ? 'include' : 'same-origin'),
    headers: {
      ...(hasBody && !isFormDataBody && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: hasBody ? (isFormDataBody ? body : JSON.stringify(body)) : undefined,
  });
};
