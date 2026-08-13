import { useState } from "react";

/**
 * Custom hook for managing confirmation modal state
 * Provides open, close, and confirm handlers
 */
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const open = (action) => {
    setPendingAction(() => action);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setPendingAction(null);
  };

  const confirm = async () => {
    if (pendingAction) {
      await pendingAction();
    }
    close();
  };

  return {
    isOpen,
    open,
    close,
    confirm
  };
};
