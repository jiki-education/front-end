import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "format-response" as const,
    name: "tasks.formatResponse.name",
    description: "tasks.formatResponse.description",
    hints: [],
    requiredScenarios: ["spotify-fred", "spotify-ihid", "spotify-griffin"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "spotify-fred",
    name: "scenarios.spotifyFred.name",
    description: "scenarios.spotifyFred.description",
    taskId: "format-response",
    functionName: "favorite_artists",
    args: ["fred"],
    expected: "fred's most listened to artists are: Glee, NSYNC, Beethoven, and Limp Bizkit!"
  },
  {
    slug: "spotify-ihid",
    name: "scenarios.spotifyIhid.name",
    description: "scenarios.spotifyIhid.description",
    taskId: "format-response",
    functionName: "favorite_artists",
    args: ["iHiD"],
    expected:
      "iHiD's most listened to artists are: Counting Crows, Rage Against The Machine, Damien Rice, Eminem, and Bastille!"
  },
  {
    slug: "spotify-griffin",
    name: "scenarios.spotifyGriffin.name",
    description: "scenarios.spotifyGriffin.description",
    taskId: "format-response",
    functionName: "favorite_artists",
    args: ["griffin"],
    expected: "Error: Unknown user"
  }
];
