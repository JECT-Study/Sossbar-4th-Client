'use client';

import { useState } from 'react';

import { PlusIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { MultiSelect } from '@/shared/components/multi-select';
import { Select } from '@/shared/components/select/select';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';

import type { UrlEntry } from '../mypage.constants';

import { CAREER_FIELD_OPTIONS, MYPAGE_MOCK_FIELDS, MYPAGE_MOCK_URLS, URL_TYPE_OPTIONS } from '../mypage.constants';
import { MypageCard } from './mypage-card';
import { MypageInfoRow } from './mypage-info-row';

const MAX_FIELDS = 3;

const findFieldLabel = (value: string) => CAREER_FIELD_OPTIONS.find((option) => option.value === value)?.label ?? value;

export const MypageCareerSection = () => {
  const [isEditing, startEditing, stopEditing] = useBooleanState(false);

  const [fields, setFields] = useState<string[]>([...MYPAGE_MOCK_FIELDS]);
  const [urls, setUrls] = useState<UrlEntry[]>([...MYPAGE_MOCK_URLS]);

  const [committedFields, setCommittedFields] = useState<string[]>([...MYPAGE_MOCK_FIELDS]);
  const [committedUrls, setCommittedUrls] = useState<UrlEntry[]>([...MYPAGE_MOCK_URLS]);

  const isMaxReached = fields.length >= MAX_FIELDS;

  const handleEdit = () => {
    setFields(committedFields);
    setUrls(committedUrls);
    startEditing();
  };

  const handleCancel = () => {
    setFields(committedFields);
    setUrls(committedUrls);
    stopEditing();
  };

  const handleSave = () => {
    setCommittedFields(fields);
    setCommittedUrls(urls);
    stopEditing();
  };

  const handleUrlChange = (id: string, patch: Partial<UrlEntry>) => {
    setUrls((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  };

  const handleAddUrl = () => {
    setUrls((prev) => [...prev, { id: crypto.randomUUID(), url: '', type: URL_TYPE_OPTIONS[0].value }]);
  };

  return (
    <MypageCard
      title="커리어 정보"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      <MypageInfoRow label="분야" align={isEditing ? 'start' : 'center'}>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <MultiSelect.Root value={fields} onValueChange={setFields}>
              <MultiSelect.Trigger>
                {fields.length === 0 ? (
                  <span className="text-text-disabled">분야를 선택해주세요</span>
                ) : (
                  fields.map((value) => (
                    <MultiSelect.Tag key={value} value={value}>
                      {findFieldLabel(value)}
                    </MultiSelect.Tag>
                  ))
                )}
              </MultiSelect.Trigger>
              <MultiSelect.Content className="w-(--radix-popover-trigger-width)">
                {CAREER_FIELD_OPTIONS.map((option) => (
                  <MultiSelect.Item
                    key={option.value}
                    value={option.value}
                    disabled={isMaxReached ? !fields.includes(option.value) : false}
                  >
                    {option.label}
                  </MultiSelect.Item>
                ))}
              </MultiSelect.Content>
            </MultiSelect.Root>
            <p className="text-body-sm text-text-subtler">최대 3개까지 등록 가능해요.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {committedFields.map((value) => (
              <span key={value} className="bg-surface-gray-subtle text-text-basic text-body-sm rounded-[4px] px-2 py-1">
                {findFieldLabel(value)}
              </span>
            ))}
          </div>
        )}
      </MypageInfoRow>

      <MypageInfoRow label="URL" align="start">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            {urls.map((entry) => (
              <div key={entry.id} className="flex gap-2">
                <Input
                  name={`url-${entry.id}`}
                  value={entry.url}
                  placeholder="https://"
                  onChange={(event) => handleUrlChange(entry.id, { url: event.target.value })}
                  className="pr-4"
                />
                <Select.Root value={entry.type} onValueChange={(value) => handleUrlChange(entry.id, { type: value })}>
                  <Select.Trigger className="w-32 shrink-0">
                    <Select.Value placeholder="Link" />
                  </Select.Trigger>
                  <Select.Content className="w-(--radix-select-trigger-width)">
                    {URL_TYPE_OPTIONS.map((option) => (
                      <Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            ))}
            <Button
              type="button"
              variant="tertiary"
              onClick={handleAddUrl}
              leftIcon={<PlusIcon className="size-5 shrink-0" aria-hidden />}
              className="border-border-gray text-text-subtle h-11 self-start rounded-[6px] border"
            >
              추가
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {committedUrls.map((entry) => (
              <span key={entry.id} className="text-text-basic text-body-base">
                {entry.url}
              </span>
            ))}
          </div>
        )}
      </MypageInfoRow>
    </MypageCard>
  );
};
