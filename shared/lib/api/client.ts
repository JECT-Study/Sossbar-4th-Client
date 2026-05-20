import { httpTransport } from './http-transport';
import { requestBuilder, type ApiRequestOptions } from './request-builder';
import { responseParser } from './response-parser';

/**
 * `/api/v1` 기반 API 요청을 보내고 타입 안전한 응답을 반환하는 함수
 *
 * @param path - 베이스 경로(`/api/v1`) 이후의 엔드포인트 (예: '/users/me')
 * @param options - 요청 옵션 (`method`, `body`, `headers`, `basePath` 등)
 * @returns 파싱된 응답 데이터 (`204` 빈 응답은 `undefined`로 반환)
 * @throws {ApiError} 네트워크 장애(503), HTTP 에러 응답(4xx/5xx)
 *
 * @example
 * const user = await apiRequest<User>('/users/me');
 * const post = await apiRequest<Post>('/posts', {
 *   method: 'POST',
 *   body: { title: 'Hello' },
 * });
 */
export const apiRequest = <T>(path: string, options: ApiRequestOptions = {}): Promise<T> =>
  httpTransport(requestBuilder(path, options)).then((res) => responseParser<T>(res));
