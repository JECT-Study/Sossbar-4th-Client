/** `"숫자/숫자"` 형태의 문자열을 카운터 객체로 파싱합니다. */
export const parseCounterText = (text?: string): { currentCount: number; totalCount: number } | null => {
  if (text == null) {
    return null;
  }

  const matched = /^(\d+)\/(\d+)$/.exec(text.replace(/\s+/g, ''));
  if (matched == null) {
    return null;
  }

  return {
    currentCount: Number(matched[1]),
    totalCount: Number(matched[2]),
  };
};
