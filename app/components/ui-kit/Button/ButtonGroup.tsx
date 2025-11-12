"use client";

import React, { type ReactNode } from "react";

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  connected?: boolean;
}

interface ButtonGroupContextType {
  size: "sm" | "md" | "lg";
  connected: boolean;
  orientation: "horizontal" | "vertical";
}

export const ButtonGroupContext = React.createContext<ButtonGroupContextType>({
  size: "md",
  connected: false,
  orientation: "horizontal"
});

export function ButtonGroup({
  children,
  className,
  size = "md",
  orientation = "horizontal",
  connected = false
}: ButtonGroupProps) {
  const contextValue = React.useMemo(() => ({ size, connected, orientation }), [size, connected, orientation]);

  const isHorizontal = orientation === "horizontal";

  const orientationClass = isHorizontal ? "flex-row" : "flex-col";
  const connectionClass = connected
    ? isHorizontal
      ? "[&>*:not(:first-child)]:ml-[-2px] [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:rounded-l-none"
      : "[&>*:not(:first-child)]:mt-[-2px] [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:rounded-t-none"
    : "gap-8";

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div className={`inline-flex ${orientationClass} ${connectionClass} ${className || ""}`} role="group">
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
}

// Hook to access button group context
export function useButtonGroup() {
  return React.useContext(ButtonGroupContext);
}

// Compound components for semantic grouping
ButtonGroup.Primary = function ButtonGroupPrimary({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`inline-flex gap-8 ${className || ""}`}>{children}</div>;
};

ButtonGroup.Secondary = function ButtonGroupSecondary({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`inline-flex gap-8 ${className || ""}`}>{children}</div>;
};

ButtonGroup.Actions = function ButtonGroupActions({
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

  return <div className={`flex gap-12 ${alignmentMap[alignment]} ${className || ""}`}>{children}</div>;
};
