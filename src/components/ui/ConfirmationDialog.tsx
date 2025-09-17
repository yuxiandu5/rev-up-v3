"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Button";

interface ConfirmationDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Function to call when the dialog should close */
  onClose: () => void;
  /** Function to call when the user confirms the action */
  onConfirm: () => void;
  /** Title of the dialog */
  title: string;
  /** Message/description in the dialog */
  message: string;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Whether the confirm action is loading */
  isLoading?: boolean;
  /** Variant of the confirm button - determines color */
  confirmVariant?: "primary" | "secondary";
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  confirmVariant = "primary"
}: ConfirmationDialogProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-[var(--bg-dark3)] rounded-lg shadow-2xl border border-[var(--bg-dark1)] w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--bg-dark1)]">
              <h3 className="text-lg font-semibold text-[var(--text1)]">
                {title}
              </h3>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <p className="text-[var(--text2)] leading-relaxed">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-[var(--bg-dark1)] flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={isLoading}
                className="min-w-[80px]"
              >
                {cancelText}
              </Button>
              <Button
                variant={confirmVariant}
                onClick={handleConfirm}
                loading={isLoading}
                disabled={isLoading}
                className="min-w-[80px] bg-red-600 hover:bg-red-700 text-white"
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;
