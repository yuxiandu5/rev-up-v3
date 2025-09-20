"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import Button from "@/components/Button";
import GreenTick from "@/components/GreenTick";

interface SaveBuildDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nickname: string, notes: string) => Promise<void>;
}

export default function SaveBuildDialog({ isOpen, onClose, onSave }: SaveBuildDialogProps) {
  const [nickname, setNickname] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const nicknameInputRef = useRef<HTMLInputElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the nickname input when dialog opens
      setTimeout(() => {
        nicknameInputRef.current?.focus();
      }, 100);

      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Reset form when dialog closes
      setNickname("");
      setNotes("");
      setError("");
      setIsLoading(false);
      setIsSuccess(false);

      // Restore body scroll
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError("Build nickname is required");
      return;
    }

    if (nickname.length > 100) {
      setError("Nickname must be 100 characters or less");
      return;
    }

    if (notes.length > 1000) {
      setError("Notes must be 1000 characters or less");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onSave(nickname.trim(), notes.trim());
      setIsSuccess(true);

      // Auto-close after showing success for 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save build";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        ref={dialogRef}
        className="
          w-full max-w-md
          bg-[var(--bg-dark1)]
          border border-[var(--bg-dark3)]
          rounded-lg
          shadow-2xl
          transform transition-all duration-200
          max-h-[90vh] overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--bg-dark3)]">
          <h2 id="dialog-title" className="text-xl font-semibold text-[var(--text1)]">
            Save Build
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="
              p-1 rounded-md
              text-[var(--text2)]
              hover:text-[var(--text1)]
              hover:bg-[var(--bg-dark3)]
              transition-colors
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-6 text-center">
            <GreenTick />
            <h3 className="mt-4 text-lg font-semibold text-[var(--text1)]">
              Build Saved Successfully!
            </h3>
            <p className="mt-2 text-sm text-[var(--text2)]">
              Your build &quot;{nickname}&quot; has been saved.
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Nickname Input */}
            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-[var(--text1)] mb-2"
              >
                Build Nickname <span className="text-red-400">*</span>
              </label>
              <input
                ref={nicknameInputRef}
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={isLoading}
                className="
                w-full px-3 py-2
                bg-[var(--bg-dark2)]
                border border-[var(--bg-dark3)]
                rounded-md
                text-[var(--text1)]
                placeholder-[var(--text2)]
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
              "
                placeholder="Enter a name for your build..."
                maxLength={100}
              />
              <p className="mt-1 text-xs text-[var(--text2)]">{nickname.length}/100 characters</p>
            </div>

            {/* Notes Textarea */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-[var(--text1)] mb-2">
                Notes <span className="text-[var(--text2)]">(optional)</span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
                rows={4}
                className="
                w-full px-3 py-2
                bg-[var(--bg-dark2)]
                border border-[var(--bg-dark3)]
                rounded-md
                text-[var(--text1)]
                placeholder-[var(--text2)]
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
                resize-vertical
              "
                placeholder="Add any notes about your build..."
                maxLength={1000}
              />
              <p className="mt-1 text-xs text-[var(--text2)]">{notes.length}/1000 characters</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-md">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || !nickname.trim()}
                className="flex-1"
              >
                {isLoading ? "Saving..." : "Save Build"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
