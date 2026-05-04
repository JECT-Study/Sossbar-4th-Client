'use client';

import { useState } from 'react';

import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { useSessionUser } from '@/shared/lib/session-user';

type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const MarketingCheckbox = ({ checked, onCheckedChange }: CheckboxProps) => (
  <>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="peer sr-only"
    />
    <span
      aria-hidden
      className={`peer-focus-visible:ring-border-primary flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-solid transition-colors peer-focus-visible:ring-2 ${
        checked ? 'bg-element-primary border-transparent' : 'border-border-gray bg-white'
      }`}
    >
      {checked ? (
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  </>
);

const disabledInputProps = {
  className: 'mx-auto max-w-none w-full',
  fieldClassName: 'rounded-md border-input-border-disabled bg-input-surface-disabled',
  inputClassName: 'font-normal text-[17px] leading-[150%] text-text-subtle',
} as const;

export const MypageForm = () => {
  const sessionUser = useSessionUser();
  const [marketingAgreed, setMarketingAgreed] = useState(true);

  const registeredDisplayName = sessionUser?.nickname ?? '';

  return (
    <div className="w-full">
      <div className="w-full border-b border-(--color-divider-gray-light)">
        <div className="mx-auto w-full max-w-[1200px] px-10">
          <div className="flex min-h-[72px] flex-col justify-center py-8">
            <h1 className="text-heading-2xl text-center font-bold tracking-tight text-(--color-text-basic)">
              마이페이지
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-10">
        <div className="pt-[105px] pb-[138px]">
          <div className="mx-auto flex w-full max-w-[480px] flex-col gap-10">
            <section aria-labelledby="mypage-basic-heading" className="w-full">
              <h2 id="mypage-basic-heading" className="text-heading-base text-text-basic mb-8 font-bold">
                기본 정보
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="mypage-name" className="text-heading-xs text-text-subtle font-bold">
                    이름
                  </label>
                  <Input {...disabledInputProps} id="mypage-name" name="name" disabled value={registeredDisplayName} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="mypage-email" className="text-heading-xs text-text-subtle font-bold">
                    이메일 주소
                  </label>
                  <Input
                    {...disabledInputProps}
                    id="mypage-email"
                    name="email"
                    type="email"
                    disabled
                    autoComplete="email"
                    defaultValue="minmin1234@naver.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="mypage-phone" className="text-heading-xs text-text-subtle font-bold">
                    휴대폰 번호
                  </label>
                  <Input
                    {...disabledInputProps}
                    id="mypage-phone"
                    name="phone"
                    type="tel"
                    disabled
                    autoComplete="tel"
                    defaultValue="01011111111"
                  />
                </div>
              </div>
            </section>

            <section aria-labelledby="mypage-marketing-heading" className="w-full">
              <h2 id="mypage-marketing-heading" className="text-heading-base text-text-basic mb-8 font-bold">
                수신 설정
              </h2>
              <label className="flex cursor-pointer items-start gap-2">
                <MarketingCheckbox checked={marketingAgreed} onCheckedChange={setMarketingAgreed} />
                <span className="text-body-sm text-text-basic leading-normal font-medium">
                  (선택) 마케팅 수신 · 홍보 목적의 개인정보 수집 및 이용에 동의합니다.
                </span>
              </label>
            </section>

            <div className="flex w-full flex-col gap-4">
              <Button type="button" size="medium" className="h-14 w-full py-0">
                정보 수정
              </Button>
              <Button
                variant="tertiary"
                size="medium"
                type="button"
                className="text-text-subtler focus-visible:ring-border-primary h-14 w-full py-0 outline-none focus-visible:ring-2"
              >
                회원 탈퇴
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
