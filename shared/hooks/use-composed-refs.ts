import type { Ref, RefCallback } from 'react';

import { useCallback } from 'react';

/**
 * 단일 ref에 노드를 연결합니다.
 * - callback ref면 callback을 실행합니다.
 * - object ref면 current에 노드를 할당합니다.
 *
 * callback ref가 cleanup 함수를 반환할 수 있으므로 반환값을 그대로 전달합니다.
 *
 * @template T ref가 가리키는 대상 노드 타입
 * @param ref 연결 대상 ref (callback ref 또는 object ref)
 * @param value ref에 할당할 노드 값
 * @returns callback ref가 반환한 cleanup 함수 또는 void
 */
const setRef = <T>(ref: Ref<T> | undefined, value: T) => {
  if (typeof ref === 'function') {
    return ref(value);
  } else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
};

/**
 * 여러 ref를 하나의 callback ref로 합성합니다.
 *
 * 각 ref에 동일한 노드를 전달하고, callback ref가 cleanup을 반환한 경우
 * 언마운트 시점에 cleanup 호출 또는 ref null 처리까지 함께 수행합니다.
 *
 * @template T ref가 가리키는 대상 노드 타입
 * @param refs 하나로 합성할 ref 목록
 * @returns React 엘리먼트에 바로 전달 가능한 단일 callback ref
 */
const composeRefs = <T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> => {
  return (node) => {
    let hasCleanup = false;

    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);

      if (!hasCleanup && typeof cleanup == 'function') {
        hasCleanup = true;
      }

      return cleanup;
    });

    if (hasCleanup) {
      return () => {
        cleanups.forEach((cleanup, index) => {
          if (typeof cleanup === 'function') {
            cleanup();
          } else {
            setRef(refs[index], null);
          }
        });
      };
    }
  };
};

/**
 * 합성된 ref callback을 메모이제이션해 안정적인 참조를 반환합니다.
 *
 * React 19의 ref cleanup 패턴을 지원하기 위해 composeRefs 결과를 그대로 사용하며,
 * refs 배열을 의존성으로 삼아 ref 구성이 바뀔 때만 새 callback을 생성합니다.
 *
 * @template T ref가 가리키는 대상 노드 타입
 * @param refs 함께 연결할 ref 목록
 * @returns 여러 ref를 동시에 갱신하는 메모이즈된 callback ref
 */
export const useComposedRefs = <T>(...refs: (Ref<T> | undefined)[]) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(composeRefs(...refs), refs);
};
