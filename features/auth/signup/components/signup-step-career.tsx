'use client';

import { useState } from 'react';

import { PlusIcon, TrashIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Label } from '@/shared/components/label';
import { MultiSelectField } from '@/shared/components/multi-select-field';
import { Select } from '@/shared/components/select';

import { FIELDS_MAX_SELECT, FIELD_OPTIONS, USER_LINKS_MAX, USER_LINK_TYPE_OPTIONS } from '../signup-constants';

interface Props {
  onPrev: () => void;
  onSubmit: () => void;
}

interface LinkRow {
  id: string;
  userLinkType: string;
  userLink: string;
}

const createLinkRow = (): LinkRow => ({
  id: crypto.randomUUID(),
  userLinkType: 'LINK',
  userLink: '',
});

export const SignupStepCareer = ({ onPrev, onSubmit }: Props) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [links, setLinks] = useState<LinkRow[]>([createLinkRow()]);

  const appendLink = () => {
    setLinks((prev) => [...prev, createLinkRow()]);
  };

  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, patch: Partial<Omit<LinkRow, 'id'>>) => {
    setLinks((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  return (
    <div className="mt-8 flex w-full max-w-[460px] flex-col">
      <MultiSelectField
        name="fields"
        label="분야"
        required
        options={FIELD_OPTIONS}
        value={selectedFields}
        onValueChange={setSelectedFields}
        max={FIELDS_MAX_SELECT}
        placeholder="분야를 최대 2개까지 선택해 주세요."
      />

      <p className="text-body-sm text-text-subtle mt-2">최대 {FIELDS_MAX_SELECT}개까지 선택할 수 있어요.</p>

      <div className="mt-8 flex flex-col gap-2">
        <Label htmlFor="url-0">URL</Label>
        {links.map((row, index) => (
          <div key={row.id} className="flex flex-col gap-1">
            <div className="group grid grid-cols-[1fr_120px_auto] gap-2">
              <Input
                id={`url-${index}`}
                name="link"
                placeholder="https://"
                className="h-10.5 px-3"
                value={row.userLink}
                onChange={(event) => updateLink(index, { userLink: event.target.value })}
              />
              <Select.Root
                value={row.userLinkType}
                onValueChange={(value) => updateLink(index, { userLinkType: value })}
              >
                <Select.Trigger aria-label="URL 유형" className="h-10.5 px-3">
                  <Select.Value />
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
                className="hover:text-icon-error px-2.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                aria-label="링크 제거"
                onClick={() => removeLink(index)}
              />
            </div>
          </div>
        ))}
        {links.length < USER_LINKS_MAX ? (
          <button
            type="button"
            onClick={appendLink}
            className="text-detail-sm text-text-subtler hover:bg-button-tertiary-fill-hover active:border-border-gray-light flex w-fit flex-row rounded-md border border-transparent pr-1.5 pl-px font-normal"
          >
            <PlusIcon className="size-5" aria-hidden />
            추가
          </button>
        ) : (
          <p className="text-text-subtler text-detail-sm font-normal">최대 {USER_LINKS_MAX}개까지 등록 가능해요</p>
        )}
      </div>

      <div className="mt-10 flex w-full gap-3">
        <Button
          type="button"
          variant="tertiary"
          size="medium"
          onClick={onPrev}
          className="border-border-gray-light w-full border"
        >
          이전
        </Button>
        <Button type="button" size="medium" onClick={onSubmit} className="w-full">
          가입완료
        </Button>
      </div>
    </div>
  );
};
