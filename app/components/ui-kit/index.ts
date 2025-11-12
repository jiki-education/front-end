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
export { Button } from "./Button";
export { FormField } from "./FormField";
export { PageHeader } from "./PageHeader";
export { PageTabs } from "./PageTabs";
export { Link } from "./Link";

// Type exports
export type { ButtonProps } from "./Button/types";
export type { FormFieldProps } from "./FormField/types";
export type { PageHeaderProps } from "./PageHeader/types";
export type { PageTabsProps, TabItem } from "./PageTabs/types";
export type { LinkProps } from "./Link/types";

// Common types and utilities
export type {
  Size,
  BaseUIProps,
  DisableableProps,
  LoadingProps,
  IconProps,
  ColorVariantProps,
  FullWidthProps,
  ClickHandler,
  ChangeHandler,
  FocusHandler,
  ColorVariant,
  UIColor,
  BlueColor,
  PurpleColor,
  GreenColor,
  GrayColor
} from "./types";

export { ANIMATION_DURATION, TRANSITION_CLASSES } from "./types";
