/** 막대+인원 수가 차지하는 스택 영역 높이(px) */
const BAR_STACK_HEIGHT_PX = 198;

/** 스택 상단 인원 수 텍스트 높이(px) */
const COUNT_TEXT_HEIGHT_PX = 18;

/** 0명 응답 막대도 영역을 유지하기 위한 최소 높이(px) */
const BAR_HEIGHT_MIN_PX = 1;

/** 인원 수 텍스트를 제외한 막대가 그려질 수 있는 최대 높이(px) */
const BAR_HEIGHT_MAX_PX = BAR_STACK_HEIGHT_PX - COUNT_TEXT_HEIGHT_PX;

/** 응답 수를 차트 막대 높이(px)로 스케일링합니다. */
export const scaleBarHeight = (count: number, maxCount: number): number => {
  if (count <= 0 || maxCount <= 0) {
    return BAR_HEIGHT_MIN_PX;
  }

  const ratio = count / maxCount;

  return Math.round(BAR_HEIGHT_MIN_PX + ratio * (BAR_HEIGHT_MAX_PX - BAR_HEIGHT_MIN_PX));
};
