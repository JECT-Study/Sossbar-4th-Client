import type { Ref } from 'react';

import { useCallback } from 'react';

export const useMergeRef = <T>(...refs: (Ref<T> | undefined)[]) => {
  return useCallback(
    (node: T | null) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      });
    },
    // refs 배열 자체는 매 렌더마다 새로 생성되므로 개별 요소를 의존성으로 사용
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
};
