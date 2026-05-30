import type { ReactNode } from 'react';

import { EllipsisVerticalIcon, EmergencyIcon } from '@/shared/assets/icons';
import { IconButton } from '@/shared/components/button';
import { Dropdown } from '@/shared/components/dropdown';
import { ImageWithFallback } from '@/shared/components/image-with-fallback';

const DEFAULT_IMAGE_PATH = '/default.png';

interface RootProps {
  children: ReactNode;
}

const ReviewListItemRoot = ({ children }: RootProps) => (
  <li className="border-border-gray-light border-b py-6">
    <article className="relative">{children}</article>
  </li>
);

interface HeadingProps {
  children: ReactNode;
}

const ReviewListItemHeading = ({ children }: HeadingProps) => (
  <div className="flex items-center gap-6 pr-8">{children}</div>
);

interface ImageProps {
  src: string | null;
  alt: string;
}

const ReviewListItemImage = ({ src, alt }: ImageProps) => (
  <ImageWithFallback
    src={src}
    fallbackSrc={DEFAULT_IMAGE_PATH}
    width={72}
    height={54}
    alt={alt}
    className="h-[54px] w-[72px] rounded-lg object-cover"
  />
);

interface HeadingTextProps {
  children: ReactNode;
}

const ReviewListItemHeadingText = ({ children }: HeadingTextProps) => <div className="space-y-1">{children}</div>;

interface TitleProps {
  children: ReactNode;
}

const ReviewListItemTitle = ({ children }: TitleProps) => (
  <h3 className="text-heading-xs text-text-subtler font-bold">{children}</h3>
);

interface DescriptionProps {
  children: ReactNode;
}

const ReviewListItemDescription = ({ children }: DescriptionProps) => (
  <p className="text-body-sm text-text-subtler font-medium">{children}</p>
);

interface ContentProps {
  children: ReactNode;
}

const ReviewListItemContent = ({ children }: ContentProps) => (
  <p className="text-body-base text-text-basic mt-4 font-normal">{children}</p>
);

interface ActionMenuProps {
  projectName: string;
}

const ReviewListItemActionMenu = ({ projectName }: ActionMenuProps) => (
  <div className="absolute top-0 right-0">
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <IconButton
          type="button"
          aria-label={`${projectName} 후기 더보기`}
          icon={<EllipsisVerticalIcon aria-hidden />}
          className="h-6 w-6 bg-transparent p-0"
        />
      </Dropdown.Trigger>
      <Dropdown.Content align="end" sideOffset={-2}>
        <Dropdown.Item>
          신고하기
          <EmergencyIcon aria-hidden className="size-5" />
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  </div>
);

export const ReviewListItem = {
  Root: ReviewListItemRoot,
  Heading: ReviewListItemHeading,
  Image: ReviewListItemImage,
  HeadingText: ReviewListItemHeadingText,
  Title: ReviewListItemTitle,
  Description: ReviewListItemDescription,
  Content: ReviewListItemContent,
  ActionMenu: ReviewListItemActionMenu,
};
