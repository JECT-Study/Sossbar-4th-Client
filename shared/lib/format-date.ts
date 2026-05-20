export const formatIsoDateToDots = (date: string) => {
  const [datePart] = date.split('T');

  return datePart.replace(/-/g, '.');
};
