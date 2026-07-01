export const spectrumKeys = {
  all: ['spectrum'] as const,
  detail: (userLink: string, projectId?: number) => [...spectrumKeys.all, userLink, projectId] as const,
};
