import type { UserPosition } from '../types/review';

const USER_POSITION_LABELS: Record<UserPosition, string> = {
  FRONTEND: '프론트엔드',
  BACKEND: '백엔드',
  PM: 'PM',
  PD: 'PD',
  AI: 'AI',
  QA: 'QA',
  ETC: '기타',
};

export const getUserPositionLabel = (position: UserPosition, detailPosition?: string): string => {
  if (position === 'ETC' && detailPosition?.trim()) {
    return detailPosition.trim();
  }

  return USER_POSITION_LABELS[position];
};
