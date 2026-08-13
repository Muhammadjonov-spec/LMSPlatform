import React from "react";
import PropTypes from "prop-types";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger"
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      button: "bg-[#FF435A] hover:bg-[#E63950]",
      text: "text-red-500"
    },
    warning: {
      button: "bg-orange-500 hover:bg-orange-600",
      text: "text-orange-500"
    },
    info: {
      button: "bg-blue-500 hover:bg-blue-600",
      text: "text-blue-500"
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.danger;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description">
      <div
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <h2 id="modal-title" className="font-bold text-2xl mb-2 text-black text-center">
          {title}
        </h2>

        {/* Message */}
        <div id="modal-description" className="text-center text-[#838C9D] mb-6 text-sm">
          {message}
        </div>

        {/* Actions */}
        <div className="flex gap-4 w-full">
          <button
            type="button"
            className="w-full rounded-full border border-[#060A23] p-3 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isLoading}
            aria-label={cancelText}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`w-full rounded-full p-3 font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentVariant.button}`}
            onClick={onConfirm}
            disabled={isLoading}
            aria-label={confirmText}>
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.node.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isLoading: PropTypes.bool,
  variant: PropTypes.oneOf(["danger", "warning", "info"])
};

export default ConfirmModal;
