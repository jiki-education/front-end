"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface InlineEditProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  type?: "text" | "email";
  placeholder?: string;
  disabled?: boolean;
  validation?: (value: string) => string | null;
}

export default function InlineEdit({
  label,
  value,
  onSave,
  type = "text",
  placeholder,
  disabled = false,
  validation
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update edit value when prop value changes
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = async () => {
    // Validate if validation function provided
    if (validation) {
      const validationError = validation(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Don't save if value hasn't changed
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      void handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="ui-form-field-large">
      <label className="text-sm text-text-secondary">{label}</label>
      {isEditing ? (
        <div>
          <div className="flex gap-8">
            <input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isSaving}
              autoFocus
            />
            <button onClick={handleSave} disabled={isSaving} className="ui-btn ui-btn-primary ui-btn-small">
              {isSaving ? <LoadingSpinner size="sm" /> : "Save"}
            </button>
            <button onClick={handleCancel} disabled={isSaving} className="ui-btn ui-btn-secondary ui-btn-small">
              Cancel
            </button>
          </div>
          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
        </div>
      ) : (
        <div className="flex gap-8">
          <input type={type} value={value} placeholder={placeholder} readOnly />
          <button
            onClick={() => setIsEditing(true)}
            disabled={disabled}
            className="ui-btn ui-btn-secondary ui-btn-small"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
