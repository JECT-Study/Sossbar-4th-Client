export const WITHDRAW_REASON_VALUES = ['low-quality', 'trust', 'alternative', 'difficulty', 'burden', 'other'] as const;

export type WithdrawReasonValue = (typeof WITHDRAW_REASON_VALUES)[number];

export const WITHDRAW_REASON_ENUM_MAP: Record<WithdrawReasonValue, string> = {
  'low-quality': 'LOW_QUALITY',
  trust: 'LOW_TRUST',
  alternative: 'FOUND_ALTERNATIVE',
  difficulty: 'HARD_TO_USE',
  burden: 'PRESSURE',
  other: 'ETC',
};

const WITHDRAW_REASON_LABELS: Record<WithdrawReasonValue, string> = {
  'low-quality': '서비스 퀄리티가 낮아요',
  trust: '신뢰도가 떨어져요',
  alternative: '대체할 만한 서비스를 찾았어요',
  difficulty: '서비스 사용이 어려워요',
  burden: '부담감이 있어요',
  other: '기타',
};

export const WITHDRAW_REASON_OPTIONS = WITHDRAW_REASON_VALUES.map((value) => ({
  value,
  label: WITHDRAW_REASON_LABELS[value],
}));
