'use client';

import { useRouter } from 'next/navigation';
import { FormProvider } from 'react-hook-form';

import { StepIndicator } from '@/shared/components/step-indicator';

import { SignupStepBasic } from './signup-step-basic';
import { SignupStepCareer } from './signup-step-career';
import { SignupStepComplete } from './signup-step-complete';
import { SIGNUP_STEPS, SIGNUP_STEP_DESCRIPTIONS } from '../auth.constants';
import { useSignupFlow } from '../auth.hooks';

export const SignupFlow = () => {
  const router = useRouter();
  const { form, currentStep, goNext, goPrev, isPending } = useSignupFlow();

  return (
    <div className="flex w-full max-w-[480px] flex-col items-center">
      <h1 className="text-heading-lg text-text-basic text-center font-bold">회원가입</h1>
      <h2 className="text-body-base text-text-subtle mt-2 mb-6 font-medium">{SIGNUP_STEP_DESCRIPTIONS[currentStep]}</h2>
      <StepIndicator steps={SIGNUP_STEPS} current={currentStep} aria-label="회원가입 단계" />

      <FormProvider {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void goNext();
          }}
          className="w-full"
          noValidate
        >
          {currentStep === 'basic' ? <SignupStepBasic onNext={goNext} /> : null}
          {currentStep === 'career' ? <SignupStepCareer onPrev={goPrev} isSubmitting={isPending} /> : null}
          {currentStep === 'complete' ? <SignupStepComplete onConfirm={() => router.push('/')} /> : null}
        </form>
      </FormProvider>
    </div>
  );
};
