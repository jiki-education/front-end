"use client";

import { useState } from "react";
import { hideModal } from "@/lib/modal/store";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ChangePasswordModalProps {
  onSave: (newPassword: string, currentPassword: string) => Promise<void>;
}

export function ChangePasswordModal({ onSave }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!currentPassword) {
      setError("Current password is required");
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setIsSaving(true);

    try {
      await onSave(newPassword, currentPassword);
      hideModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-24 max-w-md mx-auto ui-form-field-large text-left">
      <h2 className="text-2xl font-bold mb-16">Change Password</h2>

      <form onSubmit={handleSubmit} className="space-y-16">
        <div className="ui-form-field-large">
          <label htmlFor="current-password" className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            disabled={isSaving}
            autoFocus
          />
        </div>

        <div className="ui-form-field-large">
          <label htmlFor="new-password" className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            disabled={isSaving}
          />
          <p className="text-xs text-text-secondary mt-1">Must be at least 8 characters long</p>
        </div>

        <div className="ui-form-field-large">
          <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            disabled={isSaving}
          />
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={isSaving} className="ui-btn ui-btn-primary ui-btn-small flex-1">
            {isSaving ? <LoadingSpinner size="sm" /> : "Update Password"}
          </button>
          <button
            type="button"
            onClick={hideModal}
            disabled={isSaving}
            className="ui-btn ui-btn-secondary ui-btn-small flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
