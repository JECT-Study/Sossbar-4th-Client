import type { ComponentType, SVGProps } from 'react';

import type { PositionValue } from '@/features/auth';
import { BackendIcon, FrontendIcon, ProductDesignerIcon, ProductManagerIcon } from '@/shared/assets/icons';
import { Badge } from '@/shared/components/badge';

interface Props {
  positions: PositionValue[];
}

const POSITION_BADGE_MAP: Record<PositionValue, { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }> = {
  FE: { label: '프론트엔드', Icon: FrontendIcon },
  BE: { label: '백엔드', Icon: BackendIcon },
  PM: { label: '프로덕트 매니저', Icon: ProductManagerIcon },
  PD: { label: '프로덕트 디자이너', Icon: ProductDesignerIcon },
};

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
