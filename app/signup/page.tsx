'use client';

import type { ChangeEvent } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';

import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { ModalType } from '@/shared/components/modal-type';
import { Textarea } from '@/shared/components/textarea';
import { setSessionUser } from '@/shared/lib/session-user';

const BIO_MAX_LENGTH = 50;

const SignupPage = () => {
  const router = useRouter();
  const nameFieldId = useId();
  const bioFieldId = useId();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreements, setAgreements] = useState({
    age: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreements({ age: checked, terms: checked, privacy: checked, marketing: checked });
  };

  const handleAgreement = (key: keyof typeof agreements, checked: boolean) => {
    const next = { ...agreements, [key]: checked };
    setAgreements(next);
    setAgreeAll(Object.values(next).every(Boolean));
  };

  const isSubmittable = name.trim().length > 0 && agreements.age && agreements.terms && agreements.privacy;

  const handleSubmit = () => {
    if (!isSubmittable) {
      return;
    }
    setIsCompleted(true);
  };

  const handleBioChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value.slice(0, BIO_MAX_LENGTH));
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-4 py-10">
      <Image src="/Sossbar_logo.svg" alt="Sossbar 로고" width={161} height={36} />

      <h1 className="text-heading-lg mt-10 text-center leading-snug font-bold text-(--color-text-basic)">
        회원가입하고
        <br />
        협업 프로필 서비스를 시작해 보세요!
      </h1>

      <div className="mt-8 w-full max-w-[460px]">
        <div className="flex flex-col gap-1">
          <label htmlFor={nameFieldId} className="text-detail-base block font-bold text-(--color-text-basic)">
            이름
          </label>
          <Input
            id={nameFieldId}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="입력해주세요."
            className="max-w-none"
            inputClassName="text-[16px]"
          />
        </div>

        <div className="mt-10 flex flex-col gap-1">
          <label htmlFor={bioFieldId} className="text-detail-base block pb-1 font-bold text-(--color-text-basic)">
            한 줄 소개
          </label>
          <Textarea
            id={bioFieldId}
            placeholder="내용을 입력해 주세요. (기본상태)"
            value={bio}
            onChange={handleBioChange}
            rows={4}
            currentCount={bio.length}
            totalCount={BIO_MAX_LENGTH}
            className="max-w-none"
            textareaClassName="text-[16px] rounded-xl"
          />
        </div>

        <div className="mt-[40px] space-y-4 rounded-xl border border-(--color-border-gray-light) p-4">
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={agreeAll} onCheckedChange={handleAgreeAll} />
            <span className="text-[16px] font-semibold text-(--color-text-basic)">모두 동의합니다.</span>
          </label>

          <hr className="border-t border-(--color-border-gray-light)" />

          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={agreements.age} onCheckedChange={(v) => handleAgreement('age', v)} />
            <span className="text-[14px] text-(--color-text-basic)">만 14세 이상입니다.</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={agreements.terms} onCheckedChange={(v) => handleAgreement('terms', v)} />
            <span className="text-[14px] text-(--color-text-basic)">
              <Link
                href="/policies/terms-of-service"
                className="text-black underline underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                서비스 이용약관
              </Link>
              에 동의합니다. <span className="text-(--color-text-primary)">(필수)</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={agreements.privacy} onCheckedChange={(v) => handleAgreement('privacy', v)} />
            <span className="text-[14px] text-(--color-text-basic)">
              <Link
                href="/policies/privacy-policy"
                className="text-[14px] text-black underline underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                개인정보 수집/이용
              </Link>
              에 동의합니다. <span className="text-(--color-text-primary)">(필수)</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={agreements.marketing} onCheckedChange={(v) => handleAgreement('marketing', v)} />
            <span className="text-[14px] text-(--color-text-basic)">
              마케팅 수신·홍보 목적의 개인정보 수집 및 이용에 동의합니다. (선택)
            </span>
          </label>
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isSubmittable}
          size="large"
          className="mt-10 w-full rounded-xl py-4 text-[18px] font-semibold"
        >
          가입완료
        </Button>
      </div>

      {isCompleted ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="회원가입 완료"
          onClick={() => setIsCompleted(false)}
        >
          <div className="w-[360px]" onClick={(e) => e.stopPropagation()}>
            <ModalType
              name={name.trim()}
              onConfirm={() => {
                setSessionUser({ nickname: name.trim(), profileImageUrl: null });
                router.push('/');
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const Checkbox = ({ checked, onCheckedChange }: CheckboxProps) => {
  return (
    <span
      onClick={() => onCheckedChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onCheckedChange(!checked);
        }
      }}
      role="checkbox"
      tabIndex={0}
      aria-checked={checked}
      className={`focus-visible:ring-border-primary flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors outline-none focus-visible:ring-2 ${
        checked
          ? 'border-(--color-border-primary) bg-(--color-element-primary)'
          : 'border-(--color-border-gray) bg-white'
      }`}
    >
      {checked ? (
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
};

export default SignupPage;
