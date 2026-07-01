export const softSkillsKeys = {
  all: ['soft-skills'] as const,
  spectrum: (userLink: string, projectId?: number) => [...softSkillsKeys.all, 'spectrum', userLink, projectId] as const,
};
