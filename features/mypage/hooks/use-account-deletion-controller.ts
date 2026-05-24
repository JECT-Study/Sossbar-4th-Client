import { useAccountDeletionForm } from './use-account-deletion-form';
import { useAccountDeletionModalFlow } from './use-account-deletion-modal-flow';
import { useDeleteAccountMutation } from './use-delete-account.mutation';

interface Params {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const useAccountDeletionController = ({ open, onOpenChange }: Params) => {
  const { form, isDetailEnabled, canSubmit, toPayload } = useAccountDeletionForm({ open });
  const { completeOpen, setCompleteOpen, openCompleteModal } = useAccountDeletionModalFlow({ onOpenChange });
  const { mutateAsync: submitDeleteAccount, isPending: isSubmitting } = useDeleteAccountMutation();

  const handleFormSubmit = form.handleSubmit(async (data) => {
    try {
      await submitDeleteAccount(toPayload(data));
      openCompleteModal();
    } catch {
      form.setError('root', { message: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
  });

  return {
    form,
    isDetailEnabled,
    canSubmit: canSubmit && !isSubmitting,
    completeOpen,
    setCompleteOpen,
    handleFormSubmit,
    isSubmitting,
  };
};
