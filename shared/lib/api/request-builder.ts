export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  basePath?: string;
};

export type RequestBuilder = (path: string, options: ApiRequestOptions) => Request;

const DEFAULT_BASE_PATH = '/api/v1';

export const requestBuilder: RequestBuilder = (path, { basePath = DEFAULT_BASE_PATH, headers, body, ...init }) => {
  const hasBody = body !== undefined;

  return new Request(`${basePath}${path}`, {
    ...init,
    headers: {
      ...(hasBody && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: hasBody ? JSON.stringify(body) : undefined,
  });
};
