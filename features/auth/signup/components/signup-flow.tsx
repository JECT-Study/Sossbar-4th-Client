'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { StepIndicator } from '@/shared/components/step-indicator';

import type { SignupStepId } from '../signup-constants';
import type { SignupFormData } from '../types';

import { SignupStepCareer } from './signup-step-career';
import { SignupStepComplete } from './signup-step-complete';
import { SIGNUP_STEPS, SIGNUP_STEP_DESCRIPTIONS } from '../signup-constants';
import { SignupStepBasic } from './signup-step-basic';
import { useSignupForm } from '../hooks/use-signup-form';

const STEP_BASIC_FIELDS = [
  'name',
  'bio',
  'profileImage',
  'agreements',
] as const satisfies readonly (keyof SignupFormData)[];

export const SignupFlow = () => {
  const router = useRouter();
  const { form, onSubmit, isPending } = useSignupForm();
  const [currentStep, setCurrentStep] = useState<SignupStepId>('basic');

  const goNext = async () => {
    if (currentStep === 'basic') {
      if (await form.trigger([...STEP_BASIC_FIELDS])) {
        setCurrentStep('career');
      }
      return;
    }
    if (currentStep === 'career') {
      await form.handleSubmit(async (data) => {
        try {
          await onSubmit(data);
          setCurrentStep('complete');
        } catch {}
      })();
    }
  };

  const goPrev = () => {
    if (currentStep === 'career') {
      setCurrentStep('basic');
    }
  };

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
