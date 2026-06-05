import { useId, useState } from 'react';

export const useTagCollapsible = (defaultCollapsed = false) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const contentId = useId();
  return {
    isCollapsed,
    contentId,
    toggle: () => setIsCollapsed((prev) => !prev),
  };
};
