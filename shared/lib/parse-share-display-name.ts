const MAX_SHARE_DISPLAY_NAME_LENGTH = 40;

export const parseShareDisplayName = (value: string | undefined): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  return trimmed.slice(0, MAX_SHARE_DISPLAY_NAME_LENGTH);
};
