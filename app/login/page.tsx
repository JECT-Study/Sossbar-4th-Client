'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-black/70">
      <div className="flex h-[480px] w-[560px] flex-col items-center rounded-2xl border border-[0.5px] border-(--color-divider-gray) bg-white px-10">
        {/* 로고 */}
        <div className="mt-10 h-[100px] w-[100px] overflow-hidden rounded-full">
          <Image src="/login_image.svg" alt="로그인 이미지" width={100} height={100} />
        </div>

        {/* 제목 */}
        <h1 className="mt-5 text-[32px] font-bold tracking-tight text-(--color-text-basic)">간편하게 로그인하세요</h1>

        {/* 설명 */}
        <p className="mt-5 text-center text-[20px] leading-relaxed text-(--color-text-subtle)">
          소스바의 모든 기능을 카카오 계정으로
          <br />
          바로 이용할 수 있습니다.
        </p>

        {/* 카카오 로그인 버튼 */}
        <button
          type="button"
          onClick={() => router.push('/signup')}
          className="relative mt-5 flex h-14 w-full cursor-pointer items-center justify-center rounded-xl bg-[#FAE100] transition-[filter] hover:brightness-95 active:brightness-90"
        >
          <div className="absolute left-4">
            <KakaoIcon />
          </div>
          <span className="text-[20px] font-medium text-[#17191A]">카카오로 3초만에 시작하기</span>
        </button>

        {/* 약관 */}
        <p className="mt-5 mb-8 text-center text-[14px] text-(--color-text-disabled)">
          로그인 시 서비스 이용약관 및
          <br />
          개인정보 처리방침에 동의합니다.
        </p>
      </div>
    </div>
  );
};

const KakaoIcon = () => {
  return (
    <svg width="24" height="24" viewBox="56 324 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M68 327.375C62.6152 327.375 58.25 330.817 58.25 335.063C58.25 337.807 60.0749 340.216 62.8201 341.576C62.6708 342.091 61.8604 344.889 61.8282 345.109C61.8282 345.109 61.8088 345.274 61.9157 345.338C62.0227 345.401 62.1485 345.352 62.1485 345.352C62.4553 345.309 65.7057 343.026 66.2683 342.629C66.8303 342.709 67.409 342.75 68 342.75C73.3848 342.75 77.75 339.308 77.75 335.063C77.75 330.817 73.3848 327.375 68 327.375Z"
        fill="#17191A"
      />
    </svg>
  );
};

export default LoginPage;
