'use client';

import type { ComponentPropsWithRef } from 'react';

import { Avatar } from 'radix-ui';

import { EditIcon, XIcon } from '@/shared/assets/icons';
import { Button, IconButton } from '@/shared/components/button';
import { cn } from '@/shared/lib/cn';

const DEFAULT_PROFILE_SRC = '/default-profile.png';

export type ProjectMemberChipState = 'writable' | 'completed' | 'self';

interface BaseProjectMemberChipProps extends ComponentPropsWithRef<'div'> {
  name: string;
  profileImageUrl?: string | null;
}

type ReviewActionProps =
  | {
      state?: 'writable';
      onWriteReview: () => void;
    }
  | {
      state: 'completed' | 'self';
      onWriteReview?: never;
    };

type RemoveActionProps =
  | {
      removable: true;
      onRemove: () => void;
    }
  | {
      removable?: false;
      onRemove?: never;
    };

export type ProjectMemberChipProps = BaseProjectMemberChipProps & ReviewActionProps & RemoveActionProps;

export const ProjectMemberChip = ({
  className,
  name,
  onRemove,
  onWriteReview,
  profileImageUrl,
  removable,
  state,
  ...restProps
}: ProjectMemberChipProps) => {
  const showReviewButton = state !== 'self';
  const reviewCompleted = state === 'completed';
  const avatarSrc = profileImageUrl || DEFAULT_PROFILE_SRC;

  return (
    <div
      className={cn(
        'border-border-disabled bg-surface-white inline-flex h-12.25 items-center rounded-md border px-2',
        className,
      )}
      {...restProps}
    >
      <Avatar.Root className="bg-surface-gray-subtle mr-2 size-6 shrink-0 overflow-hidden rounded-full">
        <Avatar.Image src={avatarSrc} alt={`${name} 프로필 이미지`} />
        <Avatar.Fallback className="text-body-xs text-text-subtle flex h-full w-full items-center justify-center font-medium">
          {name.charAt(0)}
        </Avatar.Fallback>
      </Avatar.Root>
      <span className="text-body-base text-text-subtle font-medium">{name}</span>

      {showReviewButton ? (
        <Button
          type="button"
          variant="tertiary"
          size="small"
          disabled={reviewCompleted}
          leftIcon={<EditIcon aria-hidden className="size-4" />}
          className="ml-3 self-center"
          onClick={onWriteReview}
        >
          {reviewCompleted ? '작성 완료' : '후기 작성'}
        </Button>
      ) : null}

      {removable ? (
        <IconButton
          type="button"
          aria-label={`${name} 팀원 삭제`}
          icon={<XIcon aria-hidden className="text-icon-gray-light" />}
          className="text-icon-gray"
          onClick={onRemove}
        />
      ) : null}
    </div>
  );
};
