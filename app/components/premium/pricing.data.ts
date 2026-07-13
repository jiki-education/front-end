import type { FaqItemData, FeatureCategoryData } from "./pricing.types";

export const FEATURE_CATEGORIES: FeatureCategoryData[] = [
  {
    labelKey: "codingFundamentals",
    features: [
      {
        titleKey: "codingExercisesTitle",
        descKey: "codingExercisesDesc",
        free: true,
        premium: true
      },
      {
        titleKey: "conceptLibraryTitle",
        descKey: "conceptLibraryDesc",
        free: true,
        premium: true
      },
      {
        titleKey: "jikiChallengesTitle",
        descKey: "jikiChallengesDesc",
        free: false,
        premium: true
      },
      {
        titleKey: "askJikiTitle",
        descKey: "askJikiDesc",
        free: "oneConversation",
        premium: "unlimited"
      }
    ]
  },
  {
    labelKey: "buildWithJeremy",
    features: [
      {
        titleKey: "buildingFundamentalsTitle",
        descKey: "buildingFundamentalsDesc",
        free: "firstEpisodes",
        premium: "fullAccess"
      },
      {
        titleKey: "howThingsWorkTitle",
        descKey: "howThingsWorkDesc",
        free: "sampleEpisode",
        premium: "fullAccess"
      },
      {
        titleKey: "earlyAccessTitle",
        descKey: "earlyAccessDesc",
        free: false,
        premium: true
      }
    ]
  },
  {
    labelKey: "support",
    features: [
      {
        titleKey: "communityForumsTitle",
        descKey: "communityForumsDesc",
        free: true,
        premium: true
      },
      {
        titleKey: "livestreamsTitle",
        descKey: "livestreamsDesc",
        free: false,
        premium: true
      }
    ]
  },
  {
    labelKey: "certificates",
    features: [
      {
        titleKey: "certificatesTitle",
        descKey: "certificatesDesc",
        free: false,
        premium: true
      }
    ]
  },
  {
    labelKey: "experience",
    features: [
      {
        titleKey: "adFreeTitle",
        descKey: "adFreeDesc",
        free: false,
        premium: true
      }
    ]
  }
];

export const FAQ_ITEMS: FaqItemData[] = [
  { questionKey: "q1", answerKey: "a1" },
  { questionKey: "q2", answerKey: "a2" },
  { questionKey: "q3", answerKey: "a3" },
  { questionKey: "q4", answerLinkKeyPrefix: "a4" },
  { questionKey: "q5", answerKey: "a5" }
];
