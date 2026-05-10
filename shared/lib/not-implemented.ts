export const throwNotImplemented = (context: string): never => {
  throw new Error(`[미구현 API] ${context}`);
};
