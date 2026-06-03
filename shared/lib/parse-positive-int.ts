export const parsePositiveInt = (value: string): number | null => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};
