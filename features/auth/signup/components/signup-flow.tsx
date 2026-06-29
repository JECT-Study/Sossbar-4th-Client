'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { StepIndicator } from '@/shared/components/step-indicator';

import type { SignupStepId } from '../signup-constants';

import { SignupStepCareer } from './signup-step-career';
import { SignupStepComplete } from './signup-step-complete';
import { SIGNUP_STEPS, SIGNUP_STEP_DESCRIPTIONS } from '../signup-constants';
import { SignupStepBasic } from './signup-step-basic';

export const SignupFlow = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SignupStepId>('basic');

  const goToCareer = () => setCurrentStep('career');
  const goToBasic = () => setCurrentStep('basic');
  const goToComplete = () => setCurrentStep('complete');
  const goToHome = () => router.push('/');

  return (
    <div className="flex w-full max-w-[480px] flex-col items-center">
      <h1 className="text-heading-lg text-text-basic text-center font-bold">회원가입</h1>
      <h2 className="text-body-base text-text-subtle mt-2 mb-6 font-medium">{SIGNUP_STEP_DESCRIPTIONS[currentStep]}</h2>
      <StepIndicator steps={SIGNUP_STEPS} current={currentStep} aria-label="회원가입 단계" />

      {currentStep === 'basic' ? <SignupStepBasic onNext={goToCareer} /> : null}
      {currentStep === 'career' ? <SignupStepCareer onPrev={goToBasic} onSubmit={goToComplete} /> : null}
      {currentStep === 'complete' ? <SignupStepComplete onConfirm={goToHome} /> : null}
    </div>
  );
};
