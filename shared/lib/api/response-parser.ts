import { ApiError, type ApiErrorData } from './error';

export type ApiResponse<T> = T | { data: T; message?: string; meta?: unknown };

export type ResponseParser = <T>(response: Response) => Promise<T>;

/**
 * `Response`를 받아 타입 안전한 페이로드 `T`를 추출하는 함수
 * HTTP 에러 응답을 `ApiError`로 변환하고, 성공 응답의 `ApiResponse` 래퍼를 벗긴다.
 *
 * @param response - HTTP 응답 객체
 * @returns 파싱 및 언래핑된 페이로드. 204 빈 응답은 `undefined as T`.
 * @throws {ApiError} HTTP 에러 응답 시 (status가 응답 코드와 동일)
 */

/** 응답 바디를 JSON으로 파싱한다. 빈 바디이거나 파싱에 실패하면 `undefined`를 반환한다. */
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

/**
 * `ApiResponse<T>`에서 실제 페이로드 `T`를 추출하는 함수
 * @param response - 래퍼 객체 또는 실제 페이로드 형태의 API 응답
 * @returns 클라이언트에서 사용할 실제 페이로드 `T`
 */
const unwrapApiResponse = <T>(response: ApiResponse<T>): T => {
  if (isWrappedApiResponse(response)) {
    return response.data;
  }
  return response;
};

/**
 * HTTP 응답을 파싱해 클라이언트에서 사용할 페이로드를 반환하는 함수
 * 성공 응답은 JSON으로 파싱한 뒤 `ApiResponse` 래퍼를 벗기고, 에러 응답은 `ApiError`로 변환한다.
 *
 * @param response - 파싱할 HTTP 응답 객체
 * @returns 파싱 및 언래핑된 페이로드. 빈 응답은 `undefined as T`.
 * @throws {ApiError} HTTP 에러 응답 시 응답 status와 메시지를 포함해 발생한다.
 */
export const responseParser: ResponseParser = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = (await safeJson(response)) as ApiErrorData | undefined;
    const message = errorData?.message ?? `Request failed (${response.status})`;
    throw new ApiError(response.status, message, errorData);
  }

  const json = (await safeJson(response)) as ApiResponse<T> | undefined;
  if (json === undefined) {
    return undefined as T;
  }

  return unwrapApiResponse(json);
};

/**
 * `ApiResponse<T>`가 래핑된 응답인지 확인하는 함수
 * @param response - `ApiResponse<T>`
 * @returns `response`가 래핑된 응답인지 여부
 */
const isWrappedApiResponse = <T>(
  response: ApiResponse<T>,
): response is { data: T; message?: string; meta?: unknown } => {
  return response !== null && typeof response === 'object' && 'data' in response;
};
