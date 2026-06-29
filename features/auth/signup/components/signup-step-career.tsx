'use client';

import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { PlusIcon, TrashIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Label } from '@/shared/components/label';
import { MultiSelectField } from '@/shared/components/multi-select-field';
import { Select } from '@/shared/components/select';

import type { SignupFormData, UserLinkType } from '../types';

import { FIELDS_MAX_SELECT, FIELD_OPTIONS, USER_LINKS_MAX, USER_LINK_TYPE_OPTIONS } from '../signup-constants';
import { SignupCareerStepSchema } from '../signup-form.schema';

interface Props {
  onPrev: () => void;
  isSubmitting: boolean;
}

export const SignupStepCareer = ({ onPrev, isSubmitting }: Props) => {
  const { control, register, formState } = useFormContext<SignupFormData>();
  const { errors } = formState;
  const { fields: linkRows, append, remove } = useFieldArray({ control, name: 'links' });
  const [selectedFields, watchedLinks] = useWatch({ control, name: ['fields', 'links'] });

  const canSubmit = SignupCareerStepSchema.safeParse({ fields: selectedFields, links: watchedLinks }).success;

  return (
    <div className="mt-8 flex w-full max-w-[480px] flex-col">
      <Controller
        control={control}
        name="fields"
        render={({ field }) => (
          <MultiSelectField
            name="fields"
            label="분야"
            required
            options={FIELD_OPTIONS}
            value={field.value}
            onValueChange={field.onChange}
            max={FIELDS_MAX_SELECT}
            placeholder="분야를 최대 2개까지 선택해 주세요."
          />
        )}
      />

      {errors.fields?.message ? (
        <p className="text-body-sm text-text-error mt-2">{errors.fields.message}</p>
      ) : (
        <p className="text-body-sm text-text-subtle mt-2">최대 {FIELDS_MAX_SELECT}개까지 선택할 수 있어요.</p>
      )}

      <div className="mt-8 flex flex-col gap-2">
        <Label htmlFor="url-0">URL</Label>
        {linkRows.map((row, index) => (
          <div key={row.id} className="flex flex-col gap-1">
            <div className="group grid grid-cols-[1fr_120px_auto] gap-2">
              <Input
                id={`url-${index}`}
                placeholder="https://"
                className="h-10.5 px-3"
                {...register(`links.${index}.userLink`)}
              />
              <Controller
                control={control}
                name={`links.${index}.userLinkType`}
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={(value) => field.onChange(value as UserLinkType)}>
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
                )}
              />
              <Button
                leftIcon={<TrashIcon className="size-5" />}
                variant="tertiary"
                type="button"
                className="hover:text-icon-error px-2.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 disabled:hover:cursor-default"
                aria-label="링크 제거"
                disabled={linkRows.length <= 1}
                onClick={() => remove(index)}
              />
            </div>
            {errors.links?.[index]?.userLink?.message ? (
              <p className="text-body-sm text-text-error">{errors.links[index]?.userLink?.message}</p>
            ) : null}
          </div>
        ))}
        {linkRows.length < USER_LINKS_MAX ? (
          <button
            type="button"
            onClick={() => append({ userLinkType: 'LINK', userLink: '' })}
            className="text-detail-sm text-text-subtler hover:bg-button-tertiary-fill-hover active:border-border-gray-light flex w-fit flex-row rounded-md border border-transparent pr-1.5 pl-px font-normal"
          >
            <PlusIcon className="size-5" aria-hidden />
            추가
          </button>
        ) : (
          <p className="text-text-subtler text-detail-sm font-normal">최대 {USER_LINKS_MAX}개까지 등록 가능해요</p>
        )}
      </div>

      {errors.root?.message ? <p className="text-body-sm text-text-error mt-3">{errors.root.message}</p> : null}

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
        <Button type="submit" size="medium" disabled={!canSubmit || isSubmitting} className="w-full">
          가입완료
        </Button>
      </div>
    </div>
  );
};
