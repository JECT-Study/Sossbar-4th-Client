import { SignupFlow } from '@/features/auth/signup/components/signup-flow';

const SignupPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-73px-168px)] flex-col items-center bg-white px-4 py-15">
      <SignupFlow />
    </div>
  );
};

export default SignupPage;
