export interface FaqItemData {
  questionKey: string;
  answerKey?: string;
  // When set, the answer is rendered with an embedded support link (a4Prefix/a4Link/a4Suffix).
  answerLinkKeyPrefix?: string;
}

export interface FeatureRowData {
  titleKey: string;
  descKey: string;
  // A boolean for a tick/cross, or a value-key string resolved under premium.values.
  free: boolean | string;
  premium: boolean | string;
}

export interface FeatureCategoryData {
  labelKey: string;
  features: FeatureRowData[];
}
