'use client';

import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { PlusIcon, TrashIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Label } from '@/shared/components/label';
import { MultiSelectField } from '@/shared/components/multi-select-field';
import { Select } from '@/shared/components/select';

import type { SignupFormData, UserLinkType } from '../auth.types';

import { POSITIONS_MAX_SELECT, POSITION_OPTIONS, USER_LINKS_MAX, USER_LINK_TYPE_OPTIONS } from '../auth.constants';
import { SignupCareerStepSchema } from '../auth.schemas';

interface Props {
  onPrev: () => void;
  isSubmitting: boolean;
}

/** Figma 링크 3개 기준 카드 높이 — 링크 개수와 무관하게 CTA 위치를 고정한다. */
const CAREER_FORM_CARD_MIN_HEIGHT_CLASS = 'min-h-[440px]';

export const SignupStepCareer = ({ onPrev, isSubmitting }: Props) => {
  const { control, register, formState } = useFormContext<SignupFormData>();
  const { errors } = formState;
  const { fields: linkRows, append, remove } = useFieldArray({ control, name: 'links' });
  const [selectedPositions, watchedLinks] = useWatch({ control, name: ['positions', 'links'] });

  const canSubmit = SignupCareerStepSchema.safeParse({ positions: selectedPositions, links: watchedLinks }).success;
  const canRemoveLink = linkRows.length > 1;

  return (
    <div className="mt-8 flex w-full max-w-[480px] flex-col gap-6">
      <div className={`flex ${CAREER_FORM_CARD_MIN_HEIGHT_CLASS} flex-col gap-10 px-5 py-10`}>
        <div className="flex flex-col">
          <Controller
            control={control}
            name="positions"
            render={({ field }) => (
              <MultiSelectField
                name="positions"
                label="직군"
                required
                options={POSITION_OPTIONS.map(({ value, label, Icon }) => ({
                  value,
                  label,
                  icon: <Icon className="size-4 shrink-0" aria-hidden />,
                }))}
                value={field.value}
                onValueChange={field.onChange}
                max={POSITIONS_MAX_SELECT}
                placeholder="분야(직군)를 선택해주세요."
              />
            )}
          />

          {errors.positions?.message ? (
            <p className="text-body-sm text-text-error mt-2">{errors.positions.message}</p>
          ) : (
            <p className="text-detail-xs text-text-subtler mt-2">최대 {POSITIONS_MAX_SELECT}개까지 등록 가능해요.</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="url-0">URL</Label>
          {linkRows.map((row, index) => (
            <div key={row.id} className="flex flex-col gap-1">
              <div className="group flex items-center gap-2">
                <Input
                  id={`url-${index}`}
                  placeholder="https://"
                  className="h-10.5 min-w-0 flex-1 px-3"
                  {...register(`links.${index}.userLink`)}
                />
                <Controller
                  control={control}
                  name={`links.${index}.userLinkType`}
                  render={({ field }) => (
                    <Select.Root value={field.value} onValueChange={(value) => field.onChange(value as UserLinkType)}>
                      <Select.Trigger aria-label="URL 유형" className="h-10.5 w-[95px] shrink-0 px-3 lg:w-[120px]">
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
                {canRemoveLink ? (
                  <Button
                    leftIcon={<TrashIcon className="size-5" />}
                    variant="tertiary"
                    type="button"
                    className="hover:text-icon-error shrink-0 px-2.5 opacity-100 transition-opacity focus-visible:opacity-100 disabled:hover:cursor-default lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100"
                    aria-label="링크 제거"
                    onClick={() => remove(index)}
                  />
                ) : null}
              </div>
              {errors.links?.[index]?.userLink?.message ? (
                <p className="text-body-sm text-text-error">{errors.links[index]?.userLink?.message}</p>
              ) : null}
            </div>
          ))}
          {linkRows.length < USER_LINKS_MAX ? (
            <button
              type="button"
              onClick={() => append({ userLinkType: 'GITHUB', userLink: '' })}
              className="text-detail-sm text-text-subtle hover:bg-button-tertiary-fill-hover active:border-border-gray-light flex h-[21px] w-fit flex-row items-center rounded-md border border-transparent pr-1.5 pl-px font-medium"
            >
              <PlusIcon className="size-5" aria-hidden />
              추가
            </button>
          ) : (
            <p className="text-text-subtler text-detail-sm h-[21px] font-normal">
              최대 {USER_LINKS_MAX}개까지 등록 가능해요.
            </p>
          )}
        </div>
      </div>

      {errors.root?.message ? <p className="text-body-sm text-text-error">{errors.root.message}</p> : null}

      <div className="flex w-full gap-3">
        <Button
          type="button"
          variant="tertiary"
          size="medium"
          onClick={onPrev}
          className="border-border-gray-light text-body-xl lg:text-body-base h-14 flex-1 border lg:h-auto"
        >
          뒤로가기
        </Button>
        <Button
          type="submit"
          size="medium"
          disabled={!canSubmit || isSubmitting}
          className="text-body-xl lg:text-body-base h-14 flex-1 lg:h-auto"
        >
          가입완료
        </Button>
      </div>
    </div>
  );
};
