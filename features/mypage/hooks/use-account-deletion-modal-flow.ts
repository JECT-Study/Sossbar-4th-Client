import { useState } from 'react';

interface Params {
  onOpenChange: (open: boolean) => void;
}

export const useAccountDeletionModalFlow = ({ onOpenChange }: Params) => {
  const [completeOpen, setCompleteOpen] = useState(false);

  const openCompleteModal = () => {
    onOpenChange(false);
    setCompleteOpen(true);
  };

  return {
    completeOpen,
    setCompleteOpen,
    openCompleteModal,
  };
};
