export type ApiResponse<T> = T | { data: T; message?: string; meta?: unknown };

export const unwrapApiResponse = <T>(res: ApiResponse<T>): T => {
  if (res && typeof res === 'object' && 'data' in res) {
    return (res as { data: T }).data;
  }
  return res as T;
};
