<<<<<<< HEAD
=======
import { buildApiUrl, getApiOrigin } from './resolve-api-url';

>>>>>>> 2e07ac7 (fix: api barrel export 구문 정리 및 request-builder에 API origin 반영)
export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  basePath?: string;
};

export type RequestBuilder = (path: string, options: ApiRequestOptions) => Request;

const DEFAULT_BASE_PATH = '/api/v1';

export const requestBuilder: RequestBuilder = (path, { basePath = DEFAULT_BASE_PATH, headers, body, ...init }) => {
  const hasBody = body !== undefined;
  const url = buildApiUrl(basePath, path);
  const apiOrigin = getApiOrigin();

  return new Request(url, {
    ...init,
    credentials: init.credentials ?? (apiOrigin ? 'include' : 'same-origin'),
    headers: {
      ...(hasBody && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: hasBody ? JSON.stringify(body) : undefined,
  });
};
