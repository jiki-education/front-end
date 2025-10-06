"use client";

interface SubmitButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: "submit" | "next";
  text?: string;
}

export function SubmitButton({ onClick, disabled = false, variant = "submit", text }: SubmitButtonProps) {
  const buttonText = text || (variant === "next" ? "Next Question" : "Submit");

  const getButtonStyles = () => {
    const base = "w-full mt-6 px-6 py-3 font-semibold rounded-lg transition-colors duration-200";

    if (variant === "next") {
      return `${base} bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed`;
    }

    return `${base} bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed`;
  };

  return (
    <button onClick={onClick} disabled={disabled} className={getButtonStyles()}>
      {buttonText}
    </button>
  );
}
