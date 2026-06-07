import Image from 'next/image';

import { SignupForm } from '@/features/auth/signup/components/signup-form';

const SignupPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-4 py-10">
      <Image src="/Sossbar_logo.svg" alt="Sossbar 로고" width={161} height={36} />

      <h1 className="text-heading-lg text-text-basic mt-10 text-center leading-snug font-bold">
        회원가입하고
        <br />
        협업 프로필 서비스를 시작해 보세요!
      </h1>

      <SignupForm />
    </div>
  );
};

export default SignupPage;
