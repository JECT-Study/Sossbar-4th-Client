'use client';

import { useState } from 'react';

import { POSITION_OPTIONS, POSITIONS_MAX_SELECT, USER_LINK_TYPE_OPTIONS, USER_LINKS_MAX } from '@/features/auth';
import type { PositionValue, UserLinkType } from '@/features/auth';
import { PlusIcon, TrashIcon } from '@/shared/assets/icons';
import { Badge } from '@/shared/components/badge';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { MultiSelect } from '@/shared/components/multi-select';
import { SectionInfoRow } from '@/shared/components/section-card';
import { Select } from '@/shared/components/select/select';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';

import type { MyProfile, ProfileLink } from '../profile.types';

import { POSITION_BADGE_MAP } from '../profile.constants';
import { useUpdateProfile } from '../profile.hooks';
import { buildUpdateProfileInfo } from '../profile.lib';
import { MypageCard } from './mypage-card';

interface Props {
  profile: MyProfile;
}

interface UrlEntry {
  id: string;
  url: string;
  type: UserLinkType;
}

const findPositionLabel = (value: string) => POSITION_OPTIONS.find((option) => option.value === value)?.label ?? value;

const linksToEntries = (links: ProfileLink[]): UrlEntry[] =>
  links.length === 0
    ? [{ id: crypto.randomUUID(), url: '', type: USER_LINK_TYPE_OPTIONS[0].value }]
    : links.map((link) => ({ id: crypto.randomUUID(), url: link.userLink, type: link.userLinkType }));

export const MypageCareerSection = ({ profile }: Props) => {
  const [isEditing, startEditing, stopEditing] = useBooleanState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [positions, setPositions] = useState<PositionValue[]>(profile.defaultPositions);
  const [urls, setUrls] = useState<UrlEntry[]>(() => linksToEntries(profile.links));

  const isMaxReached = positions.length >= POSITIONS_MAX_SELECT;

  const resetDraft = () => {
    setPositions(profile.defaultPositions);
    setUrls(linksToEntries(profile.links));
  };

  const handleEdit = () => {
    resetDraft();
    startEditing();
  };

  const handleCancel = () => {
    resetDraft();
    stopEditing();
  };

  const handleSave = () => {
    const links = urls
      .map(({ url, type }) => ({ userLink: url.trim(), userLinkType: type }))
      .filter(({ userLink }) => userLink.length > 0);

    updateProfile(
      {
        info: buildUpdateProfileInfo(profile, { defaultPositions: positions, links }),
        profileImage: null,
      },
      { onSuccess: () => stopEditing() },
    );
  };

  const handleUrlChange = (id: string, patch: Partial<UrlEntry>) => {
    setUrls((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  };

  const handleAddUrl = () => {
    setUrls((prev) => [...prev, { id: crypto.randomUUID(), url: '', type: USER_LINK_TYPE_OPTIONS[0].value }]);
  };

  const handleRemoveUrl = (id: string) => {
    setUrls((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <MypageCard
      title="커리어 정보"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      isSaving={isPending}
    >
      <SectionInfoRow label="직군" align={isEditing ? 'start' : 'center'}>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <MultiSelect.Root value={positions} onValueChange={(next) => setPositions(next as PositionValue[])}>
              <MultiSelect.Trigger>
                {positions.length === 0 ? (
                  <span className="text-text-disabled">직군을 선택해주세요</span>
                ) : (
                  positions.map((value) => (
                    <MultiSelect.Tag key={value} value={value}>
                      {findPositionLabel(value)}
                    </MultiSelect.Tag>
                  ))
                )}
              </MultiSelect.Trigger>
              <MultiSelect.Content className="w-(--radix-popover-trigger-width)">
                {POSITION_OPTIONS.map((option) => (
                  <MultiSelect.Item
                    key={option.value}
                    value={option.value}
                    disabled={isMaxReached ? !positions.includes(option.value) : false}
                  >
                    {option.label}
                  </MultiSelect.Item>
                ))}
              </MultiSelect.Content>
            </MultiSelect.Root>
            <p className="text-body-sm text-text-subtler">최대 {POSITIONS_MAX_SELECT}개까지 등록 가능해요.</p>
          </div>
        ) : (
          <div className="flex flex-nowrap gap-2 overflow-x-auto">
            {profile.defaultPositions.map((position) => {
              const { label, Icon } = POSITION_BADGE_MAP[position];
              return (
                <Badge key={position} icon={<Icon />} className="shrink-0">
                  {label}
                </Badge>
              );
            })}
          </div>
        )}
      </SectionInfoRow>

      <SectionInfoRow label="URL" align="start">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            {urls.map((entry) => (
              <div key={entry.id} className="group grid grid-cols-[1fr_120px_auto] gap-2">
                <Input
                  name={`url-${entry.id}`}
                  value={entry.url}
                  placeholder="https://"
                  onChange={(event) => handleUrlChange(entry.id, { url: event.target.value })}
                  className="h-10.5 px-3"
                />
                <Select.Root
                  value={entry.type}
                  onValueChange={(value) => handleUrlChange(entry.id, { type: value as UserLinkType })}
                >
                  <Select.Trigger aria-label="URL 유형" className="h-10.5 px-3">
                    <Select.Value placeholder="Link" />
                  </Select.Trigger>
                  <Select.Content className="w-(--radix-select-trigger-width)">
                    {USER_LINK_TYPE_OPTIONS.map((option) => (
                      <Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Button
                  leftIcon={<TrashIcon className="size-5" />}
                  variant="tertiary"
                  type="button"
                  className="hover:text-icon-error px-2.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 disabled:hover:cursor-default"
                  aria-label="링크 제거"
                  disabled={urls.length <= 1}
                  onClick={() => handleRemoveUrl(entry.id)}
                />
              </div>
            ))}
            {urls.length < USER_LINKS_MAX ? (
              <button
                type="button"
                onClick={handleAddUrl}
                className="text-detail-sm text-text-subtler hover:bg-button-tertiary-fill-hover active:border-border-gray-light flex w-fit flex-row rounded-md border border-transparent pr-1.5 pl-px font-normal"
              >
                <PlusIcon className="size-5" aria-hidden />
                추가
              </button>
            ) : (
              <p className="text-text-subtler text-detail-sm font-normal">최대 {USER_LINKS_MAX}개까지 등록 가능해요</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {profile.links.length === 0 ? (
              <span className="text-text-subtle text-body-base">-</span>
            ) : (
              profile.links.map((link) => (
                <span key={link.linkId} className="text-text-basic text-body-base">
                  {link.userLink}
                </span>
              ))
            )}
          </div>
        )}
      </SectionInfoRow>
    </MypageCard>
  );
};
