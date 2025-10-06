"use client";

import { CheckCircle, XCircle, Info } from "lucide-react";

interface InfoBoxProps {
  type: "success" | "error" | "info" | null;
  title?: string;
  message?: string;
}

export function InfoBox({ type, title, message }: InfoBoxProps) {
  if (!type || (!title && !message)) {
    return null;
  }

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-900",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-900",
          icon: <XCircle className="w-5 h-5 text-red-600" />
        };
      case "info":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-900",
          icon: <Info className="w-5 h-5 text-blue-600" />
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-900",
          icon: null
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`mt-4 p-4 ${styles.bg} border ${styles.border} rounded-lg`}>
      <div className="flex items-start gap-3">
        {styles.icon && <div className="mt-0.5 flex-shrink-0">{styles.icon}</div>}
        <div className={`text-sm ${styles.text}`}>
          {title && <p className="font-semibold mb-1">{title}</p>}
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}
