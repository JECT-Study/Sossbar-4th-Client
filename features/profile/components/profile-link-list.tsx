import type { ComponentType, SVGProps } from 'react';

import { USER_LINK_TYPE_OPTIONS } from '@/features/auth';
import type { UserLinkType } from '@/features/auth';
import { GithubIcon, LinkedinIcon, NotionIcon } from '@/shared/assets/icons';

import type { ProfileLink } from '../profile.types';

interface Props {
  links: ProfileLink[];
}

const LINK_ICON_MAP: Record<UserLinkType, ComponentType<SVGProps<SVGSVGElement>>> = {
  GITHUB: GithubIcon,
  LINKEDIN: LinkedinIcon,
  NOTION: NotionIcon,
};

const findLinkTypeLabel = (value: UserLinkType) =>
  USER_LINK_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value;

export const ProfileLinkList = ({ links }: Props) => {
  if (links.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-row flex-wrap items-center gap-2">
      {links.map((link) => {
        const Icon = LINK_ICON_MAP[link.userLinkType];
        return (
          <li key={link.linkId}>
            <a
              href={link.userLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={findLinkTypeLabel(link.userLinkType)}
              className="bg-surface-gray-subtle text-text-basic hover:bg-surface-gray-subtler inline-flex size-9 items-center justify-center rounded-full transition-colors"
            >
              <Icon aria-hidden className="size-5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
};
