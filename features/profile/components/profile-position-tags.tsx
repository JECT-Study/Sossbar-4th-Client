import type { PositionValue } from '@/features/auth';
import { Badge } from '@/shared/components/badge';

import { POSITION_BADGE_MAP } from '../profile.constants';

interface Props {
  positions: PositionValue[];
}

export const ProfilePositionTags = ({ positions }: Props) => {
  if (positions.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {positions.map((position) => {
        const { label, Icon } = POSITION_BADGE_MAP[position];
        return (
          <li key={position}>
            <Badge icon={<Icon />}>{label}</Badge>
          </li>
        );
      })}
    </ul>
  );
};
