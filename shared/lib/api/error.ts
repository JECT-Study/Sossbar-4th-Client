export type ApiErrorData = {
  message: string;
  code?: string;
  details?: unknown;
};

/**
 * HTTP 요청 실패를 나타내는 에러.
 * 네트워크 장애, HTTP 4xx/5xx 응답 모두 이 클래스로 throw된다.
 *
 * @example
 * try {
 *   await apiRequest('/users/me');
 * } catch (error) {
 *   if (error instanceof ApiError && error.status === 401) {
 *     redirect('/login');
 *   }
 * }
 */
export class ApiError extends Error {
  readonly status: number;
  readonly errorData?: ApiErrorData;

  constructor(status: number, message: string, errorData?: ApiErrorData) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorData = errorData;
  }
}
