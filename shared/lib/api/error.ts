export type ApiErrorData = {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
};

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
