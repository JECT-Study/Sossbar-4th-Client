'use client';

import { useRouter } from 'next/navigation';
import { Checkbox } from 'radix-ui';

import { Button } from '@/shared/components/button';
import { Dropmodal } from '@/shared/components/dropmodal';
import { Input } from '@/shared/components/input';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';
import { cn } from '@/shared/lib/cn';
import { clearSessionUser, useSessionUser } from '@/shared/lib/session-user';

const nameInputProps = {
  className: 'mx-auto max-w-none w-full',
  fieldClassName: 'rounded-md border-input-border bg-input-surface',
  inputClassName: 'font-normal text-body-base leading-[150%] text-text-basic',
} as const;

const emailInputProps = {
  className: 'mx-auto max-w-none w-full',
  fieldClassName: 'rounded-md border-input-border-disabled bg-input-surface-disabled',
  inputClassName: 'font-normal text-body-base leading-[150%] text-text-disabled',
} as const;

export const MypageForm = () => {
  const router = useRouter();
  const sessionUser = useSessionUser();
  const [marketingAgreed, setMarketingAgreedTrue, setMarketingAgreedFalse] = useBooleanState(true);
  const [withdrawOpen, openWithdraw, closeWithdraw] = useBooleanState(false);

  const registeredDisplayName = sessionUser?.nickname ?? '';
  const registeredEmail = sessionUser?.email ?? 'minmin1234@naver.com';

  return (
    <>
      <div className="mx-auto w-full max-w-[1200px] px-10 pt-[65px] pb-[98px]">
        <div className="mx-auto flex w-full max-w-[560px] justify-center">
          <form className="flex w-full max-w-[480px] flex-col gap-10 py-10" onSubmit={(e) => e.preventDefault()}>
            <section aria-labelledby="mypage-basic-heading" className="w-full">
              <h2 id="mypage-basic-heading" className="text-heading-base text-text-basic mb-8 font-bold">
                기본 정보
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="mypage-name" className="text-heading-xs text-text-subtle font-bold">
                    이름
                  </label>
                  <Input {...nameInputProps} id="mypage-name" name="name" value={registeredDisplayName} readOnly />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="mypage-email" className="text-heading-xs text-text-subtle font-bold">
                    이메일 주소
                  </label>
                  <Input
                    {...emailInputProps}
                    id="mypage-email"
                    name="email"
                    type="email"
                    disabled
                    autoComplete="email"
                    value={registeredEmail}
                    readOnly
                  />
                </div>
              </div>
            </section>

            <section aria-labelledby="mypage-marketing-heading" className="w-full">
              <h2 id="mypage-marketing-heading" className="text-heading-base text-text-basic mb-8 font-bold">
                수신 설정
              </h2>
              <label className="flex cursor-pointer items-start gap-2">
                <Checkbox.Root
                  checked={marketingAgreed}
                  onCheckedChange={(checked) =>
                    checked === true ? setMarketingAgreedTrue() : setMarketingAgreedFalse()
                  }
                  className={cn(
                    'focus-visible:ring-border-primary flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-solid transition-colors focus-visible:ring-2 focus-visible:outline-none',
                    marketingAgreed ? 'bg-element-primary border-transparent' : 'border-border-gray bg-white',
                  )}
                >
                  <Checkbox.Indicator>
                    <svg
                      width="12"
                      height="9"
                      viewBox="0 0 12 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M1 4L4.5 7.5L11 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="text-detail-sm text-text-basic pt-px leading-normal font-medium">
                  (선택) 마케팅 수신 · 홍보 목적의 개인정보 수집 및 이용에 동의합니다.
                </span>
              </label>
            </section>

            <div className="flex w-full flex-col gap-4">
              <Button type="submit" size="medium" className="text-body-xl h-14 w-full py-0">
                정보 수정
              </Button>
              <Button
                variant="tertiary"
                size="medium"
                type="button"
                className="text-text-disabled focus-visible:ring-border-primary text-body-xl h-14 w-full py-0 outline-none focus-visible:ring-2"
                onClick={openWithdraw}
              >
                회원 탈퇴
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Dropmodal
        open={withdrawOpen}
        onOpenChange={(open) => (open ? openWithdraw() : closeWithdraw())}
        onConfirm={() => {
          clearSessionUser();
          router.push('/');
        }}
      />
    </>
  );
};
