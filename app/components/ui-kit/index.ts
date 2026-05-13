/**
 * UI Kit - Main Export File
 *
 * This file exports all UI kit components and their types.
 * Use this for importing components in your application.
 *
 * @example
 * import { Button, FormField, PageHeader } from '@/components/ui-kit';
 */

// Component exports
export { Button, ButtonGroup, ButtonWithRenderProps } from "./Button";
export { CloseButton } from "./CloseButton";
export { FormField, FormFieldGroup, FormFieldWithRenderProps } from "./FormField";
export { PageTabs, TabContainer, useTabContainer, TabPanel } from "./PageTabs";
export { Link } from "./Link";

// Type exports
export type { ButtonProps } from "./Button/types";
export type { FormFieldProps } from "./FormField/types";
export type { PageTabsProps, TabItem } from "./PageTabs/types";
export type { LinkProps } from "./Link/types";

// Common types and utilities
export type {
  Size,
  BaseUIProps,
  DisableableProps,
  LoadingProps,
  IconProps,
  FullWidthProps,
  ColorVariant
} from "./types";

export { TRANSITION_CLASSES } from "./types";
