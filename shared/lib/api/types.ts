export type ApiErrorPayload = {
  message: string;
  code?: string;
  details?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly payload?: ApiErrorPayload;

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

/**
 * Backend response "contract" (minimal).
 *
 * We currently accept both:
 * - plain data: T
 * - wrapped data: { data: T, ... }
 *
 * This allows the FE to move fast while BE spec is still evolving.
 */
export type ApiResponse<T> = T | { data: T; message?: string; meta?: unknown };

export const unwrapApiResponse = <T>(res: ApiResponse<T>): T => {
  if (res && typeof res === 'object' && 'data' in res) {
    return (res as { data: T }).data;
  }
  return res as T;
};
