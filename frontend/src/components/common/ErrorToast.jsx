import React, { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Reusable error toast component
 */
const ErrorToast = ({ message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (message && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Close notification">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

ErrorToast.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
};

export default ErrorToast;
