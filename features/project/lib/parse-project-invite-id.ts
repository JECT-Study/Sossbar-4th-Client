export const parseProjectInviteId = (raw: string | null): number | null => {
  if (raw == null || raw.trim() === '') {
    return null;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};
