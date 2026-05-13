import type { ReactNode } from "react";

export interface FaqItem {
  question: string;
  answer: ReactNode;
}

export interface FeatureRowData {
  title: ReactNode;
  desc: string;
  free: boolean | string;
  premium: boolean | string;
}

export interface FeatureCategoryData {
  label: string;
  features: FeatureRowData[];
}
