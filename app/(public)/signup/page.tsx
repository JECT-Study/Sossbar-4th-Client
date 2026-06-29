import { SignupFlow } from '@/features/auth/signup/components/signup-flow';

const SignupPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-4 py-15">
      <SignupFlow />
    </div>
  );
};

export default SignupPage;
