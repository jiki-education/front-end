"use client";

import { useState } from "react";
import { hideModal } from "@/lib/modal/store";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ChangeEmailModalProps {
  currentEmail: string;
  onSave: (newEmail: string, currentPassword: string) => Promise<void>;
}

export function ChangeEmailModal({ currentEmail, onSave }: ChangeEmailModalProps) {
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!newEmail) {
      setError("New email is required");
      return;
    }

    if (!validateEmail(newEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (newEmail === currentEmail) {
      setError("New email must be different from current email");
      return;
    }

    if (!currentPassword) {
      setError("Current password is required");
      return;
    }

    setIsSaving(true);

    try {
      await onSave(newEmail, currentPassword);
      hideModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update email");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-24 max-w-md mx-auto text-left">
      <h2 className="text-2xl font-bold mb-16">Change Email Address</h2>

      <div className="bg-blue-50 text-blue-700 p-12 rounded-md text-sm mb-16">
        <p className="font-semibold mb-4">Important:</p>
        <p>
          A confirmation email will be sent to your new email address. You&apos;ll need to confirm it before the change
          takes effect.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-16 ">
        <div className="ui-form-field-large">
          <label className="block text-sm font-semibold mb-1">Current Email</label>
          <input type="email" value={currentEmail} disabled />
        </div>

        <div className="ui-form-field-large">
          <label htmlFor="new-email" className="block text-sm font-semibold mb-1">
            New Email Address
          </label>
          <input
            id="new-email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter your new email address"
            disabled={isSaving}
            autoFocus
          />
        </div>

        <div className="ui-form-field-large">
          <label htmlFor="current-password" className="block text-sm font-semibold mb-1">
            Confirm with Current Password
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            disabled={isSaving}
          />
          <p className="text-xs text-text-secondary mt-1">Required for security verification</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={isSaving} className="ui-btn ui-btn-small ui-btn-primary flex-1">
            {isSaving ? <LoadingSpinner size="sm" /> : "Update Email"}
          </button>
          <button
            type="button"
            onClick={hideModal}
            disabled={isSaving}
            className="ui-btn ui-btn-small ui-btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
