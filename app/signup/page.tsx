'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ModalType } from '@/shared/components/modal-type';

const BIO_MAX_LENGTH = 50;

const SignupPage = () => {
  const router = useRouter();
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

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-4 py-10">
      {/* 로고 */}
      <Image src="/Sossbar_logo.svg" alt="Sossbar 로고" width={161} height={36} />

      {/* 타이틀 */}
      <h1 className="text-heading-lg mt-10 text-center leading-snug font-bold text-(--color-text-basic)">
        회원가입하고
        <br />
        협업 프로필 서비스를 시작해 보세요!
      </h1>

      {/* 폼 */}
      <div className="mt-8 w-full max-w-[460px]">
        {/* 이름 */}
        <div className="flex flex-col gap-1">
          <label className="text-detail-base block font-bold text-(--color-text-basic)">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="입력해주세요."
            className="w-full rounded-xl border border-(--color-input-border) px-4 py-3 text-[16px] text-(--color-text-basic) outline-none placeholder:text-(--color-text-disabled) focus:border-(--color-border-primary)"
          />
        </div>

        {/* 한 줄 소개 */}
        <div className="mt-[40px] flex flex-col gap-1">
          <label className="text-detail-base block pb-1 font-bold text-(--color-text-basic)">한 줄 소개</label>
          <div className="flex flex-col gap-2">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX_LENGTH))}
              placeholder="내용을 입력해 주세요. (기본상태)"
              rows={4}
              className="w-full resize-none rounded-xl border border-(--color-input-border) px-4 py-3 text-[16px] text-(--color-text-basic) outline-none placeholder:text-(--color-text-disabled) focus:border-(--color-border-primary)"
            />
            <span className="self-end text-[13px] text-(--color-text-disabled)">
              {bio.length}/{BIO_MAX_LENGTH}
            </span>
          </div>
        </div>

        {/* 약관 동의 */}
        <div className="mt-[40px] space-y-4 rounded-xl border border-(--color-border-gray-light) p-4">
          {/* 전체 동의 */}
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={agreeAll} onChange={handleAgreeAll} />
            <span className="text-[16px] font-semibold text-(--color-text-basic)">모두 동의합니다.</span>
          </label>

          <hr className="border-t border-(--color-border-gray-light)" />

          {/* 개별 동의 항목 */}
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={agreements.age} onChange={(v) => handleAgreement('age', v)} />
            <span className="text-[14px] text-(--color-text-basic)">만 14세 이상입니다.</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={agreements.terms} onChange={(v) => handleAgreement('terms', v)} />
            <span className="text-[14px] text-(--color-text-basic)">
              <Link
                href="/terms"
                className="text-black underline underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                서비스 이용약관
              </Link>
              에 동의합니다. <span className="text-(--color-text-primary)">(필수)</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={agreements.privacy} onChange={(v) => handleAgreement('privacy', v)} />
            <span className="text-[14px] text-(--color-text-basic)">
              <Link
                href="/personal"
                className="text-[14px] text-black underline underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                개인정보 수집/이용
              </Link>
              에 동의합니다. <span className="text-(--color-text-primary)">(필수)</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={agreements.marketing} onChange={(v) => handleAgreement('marketing', v)} />
            <span className="text-[14px] text-(--color-text-basic)">
              마케팅 수신·홍보 목적의 개인정보 수집 및 이용에 동의합니다. (선택)
            </span>
          </label>
        </div>

        {/* 가입완료 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isSubmittable}
          className="mt-[40px] w-full rounded-xl py-4 text-[18px] font-semibold transition-colors enabled:bg-(--color-button-primary-fill) enabled:text-(--color-text-basic-inverse) enabled:hover:bg-(--color-button-primary-fill-hover) enabled:active:bg-(--color-button-primary-fill-pressed) disabled:cursor-not-allowed disabled:bg-(--color-button-disabled-fill) disabled:text-(--color-text-disabled)"
        >
          가입완료
        </button>
      </div>

      {!!isCompleted && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="회원가입 완료"
          onClick={() => setIsCompleted(false)}
        >
          <div className="w-[360px]" onClick={(e) => e.stopPropagation()}>
            <ModalType name={name.trim()} onConfirm={() => router.push('/')} />
          </div>
        </div>
      )}
    </div>
  );
};

const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) => {
  return (
    <span
      onClick={() => onChange(!checked)}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
        checked
          ? 'border-(--color-border-primary) bg-(--color-element-primary)'
          : 'border-(--color-border-gray) bg-white'
      }`}
    >
      {!!checked && (
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
};

export default SignupPage;
