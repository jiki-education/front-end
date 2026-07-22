export type ItemStatus = "shipped" | "in-progress" | "planned";

export interface RoadmapItem {
  key: string;
  status: ItemStatus;
}

export interface RoadmapPhase {
  key: string;
  items: RoadmapItem[];
}

export interface ChangelogEntry {
  key: string;
}

export const changelog: ChangelogEntry[] = [
  { key: "learnToBuildLaunch" },
  { key: "milestones6To10" },
  { key: "jikiLaunch" }
];

export const phases: RoadmapPhase[] = [
  {
    key: "now",
    items: [
      { key: "learnToBuild", status: "shipped" },
      { key: "launchBugs", status: "in-progress" },
      { key: "earlyFeedback", status: "in-progress" },
      { key: "foundations", status: "in-progress" }
    ]
  },
  {
    key: "next",
    items: [
      { key: "betaToLive", status: "planned" },
      { key: "deepDiveVideos", status: "planned" },
      { key: "newLanguages", status: "planned" },
      { key: "pythonVersion", status: "planned" }
    ]
  },
  {
    key: "future",
    items: [
      { key: "moreLanguages", status: "planned" },
      { key: "sql", status: "planned" }
    ]
  }
];
