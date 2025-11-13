"use client";

import React, { type ReactNode } from "react";

interface FormFieldGroupProps {
  children: ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg";
}

interface FormFieldGroupContextType {
  spacing: "sm" | "md" | "lg";
}

export const FormFieldGroupContext = React.createContext<FormFieldGroupContextType>({
  spacing: "md"
});

const spacingMap = {
  sm: "space-y-16",
  md: "space-y-24",
  lg: "space-y-32"
} as const;

export function FormFieldGroup({ children, className, spacing = "md" }: FormFieldGroupProps) {
  const contextValue = React.useMemo(() => ({ spacing }), [spacing]);

  return (
    <FormFieldGroupContext.Provider value={contextValue}>
      <div className={`w-full ${spacingMap[spacing]} ${className || ""}`}>{children}</div>
    </FormFieldGroupContext.Provider>
  );
}

// Hook to access the group context
export function useFormFieldGroup() {
  return React.useContext(FormFieldGroupContext);
}

// Compound components
FormFieldGroup.Field = function FormFieldGroupField({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
};

FormFieldGroup.Section = function FormFieldGroupSection({
  title,
  children,
  className
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-12 ${className || ""}`}>
      {title && <h3 className="text-lg font-medium text-gray-900 mb-16">{title}</h3>}
      <div className="space-y-16">{children}</div>
    </div>
  );
};

FormFieldGroup.Actions = function FormFieldGroupActions({
  children,
  alignment = "left",
  className
}: {
  children: ReactNode;
  alignment?: "left" | "center" | "right" | "between";
  className?: string;
}) {
  const alignmentMap = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between"
  };

  return <div className={`flex gap-12 pt-8 ${alignmentMap[alignment]} ${className || ""}`}>{children}</div>;
};
