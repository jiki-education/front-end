export type ItemStatus = "shipped" | "in-progress" | "planned";

export interface RoadmapItem {
  titleKey: string;
  descriptionKey: string;
  status: ItemStatus;
}

export interface RoadmapPhase {
  labelKey: string;
  timeframeKey: string;
  summaryKey?: string;
  items: RoadmapItem[];
}

export interface ChangelogEntry {
  dateKey: string;
  titleKey: string;
  descriptionKey: string;
}

export const changelog: ChangelogEntry[] = [
  {
    dateKey: "entry1Date",
    titleKey: "entry1Title",
    descriptionKey: "entry1Description"
  }
];

export const phases: RoadmapPhase[] = [
  {
    labelKey: "nowLabel",
    timeframeKey: "nowTimeframe",
    summaryKey: "nowSummary",
    items: [
      { titleKey: "nowItem1Title", descriptionKey: "nowItem1Description", status: "in-progress" },
      { titleKey: "nowItem2Title", descriptionKey: "nowItem2Description", status: "in-progress" },
      { titleKey: "nowItem3Title", descriptionKey: "nowItem3Description", status: "in-progress" }
    ]
  },
  {
    labelKey: "nextLabel",
    timeframeKey: "nextTimeframe",
    summaryKey: "nextSummary",
    items: [
      { titleKey: "nextItem1Title", descriptionKey: "nextItem1Description", status: "planned" },
      { titleKey: "nextItem2Title", descriptionKey: "nextItem2Description", status: "planned" },
      { titleKey: "nextItem3Title", descriptionKey: "nextItem3Description", status: "planned" },
      { titleKey: "nextItem4Title", descriptionKey: "nextItem4Description", status: "planned" }
    ]
  },
  {
    labelKey: "futureLabel",
    timeframeKey: "futureTimeframe",
    summaryKey: "futureSummary",
    items: [
      { titleKey: "futureItem1Title", descriptionKey: "futureItem1Description", status: "planned" },
      { titleKey: "futureItem2Title", descriptionKey: "futureItem2Description", status: "planned" }
    ]
  }
];
