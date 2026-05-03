'use client';

import type { ComponentProps, MouseEvent, MouseEventHandler } from 'react';

import { motion, useAnimate } from 'motion/react';

import { Button } from './button';

interface Props extends ComponentProps<typeof Button> {
  onPressComplete?: (event: MouseEvent<HTMLButtonElement>) => void;
}

// NOTE: CTA 버튼 및 모바일 중심 디자인에 사용되는 버튼 컴포넌트
export const PressableButton = ({ children, disabled, onPressComplete, ...restProps }: Props) => {
  const [scope, animate] = useAnimate();

  const restoreScale = async () => {
    if (!scope.current) {
      return;
    }

    await animate(scope.current, { scale: 1 }, { type: 'tween', ease: 'circOut', duration: 0.08 });
  };

  const handlePointerDown = () => {
    if (disabled || !scope.current) {
      return;
    }

    animate(scope.current, { scale: 0.98 }, { duration: 0.08 });
  };

  const handlePointerLeave = () => {
    if (disabled) {
      return;
    }

    restoreScale();
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    if (disabled) {
      return;
    }

    await restoreScale();
    onPressComplete?.(event);
  };

  return (
    <Button asChild disabled={disabled} {...restProps}>
      <motion.button
        ref={scope}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        {children}
      </motion.button>
    </Button>
  );
};
