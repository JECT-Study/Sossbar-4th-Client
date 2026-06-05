export const softSkillsKeys = {
  all: ['soft-skills'] as const,
  spectrum: (userId: number, projectId?: number) => [...softSkillsKeys.all, 'spectrum', userId, projectId] as const,
};
