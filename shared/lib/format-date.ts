export const formatIsoDateToDots = (date: string | null | undefined): string => {
  if (!date) {
    return '';
  }

  const [datePart] = date.split('T');

  return datePart.replace(/-/g, '.');
};
