import { useCallback, useState } from 'react';

export const useBooleanState = (defaultValue: boolean = false) => {
  const [boolean, setBoolean] = useState(defaultValue);

  const setTrue = useCallback(() => setBoolean(true), []);
  const setFalse = useCallback(() => setBoolean(false), []);
  const toggle = useCallback(() => setBoolean((prevState) => !prevState), []);

  return [boolean, setTrue, setFalse, toggle] as const;
};
