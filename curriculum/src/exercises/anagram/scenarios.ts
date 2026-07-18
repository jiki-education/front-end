import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "find-anagrams" as const,
    name: "tasks.findAnagrams.name",
    description: "tasks.findAnagrams.description",
    hints: [],
    requiredScenarios: [
      "no-matches",
      "two-anagrams",
      "no-subsets",
      "single-match",
      "different-case",
      "case-insensitive",
      "not-itself",
      "other-than-itself"
    ],
    bonus: false
  },
  {
    id: "sorted-results" as const,
    name: "tasks.sortedResults.name",
    description: "tasks.sortedResults.description",
    hints: [],
    requiredScenarios: ["alphabetical-sorting"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "no-matches",
    name: "scenarios.noMatches.name",
    description: "scenarios.noMatches.description",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["diaper", ["hello", "world", "zombies", "pants"]],
    expected: []
  },
  {
    slug: "two-anagrams",
    name: "scenarios.twoAnagrams.name",
    description: "scenarios.twoAnagrams.description",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["master", ["maters", "stream", "pigeon"]],
    expected: ["maters", "stream"]
  },
  {
    slug: "no-subsets",
    name: "scenarios.noSubsets.name",
    description: "scenarios.noSubsets.description",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["good", ["dog", "goody"]],
    expected: []
  },
  {
    slug: "single-match",
    name: "scenarios.singleMatch.name",
    description: "scenarios.singleMatch.description",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["listen", ["enlists", "google", "inlets", "banana"]],
    expected: ["inlets"]
  },
  {
    slug: "different-case",
    name: "scenarios.differentCase.name",
    description: "scenarios.differentCase.description",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["nose", ["Eons", "ONES"]],
    expected: ["Eons", "ONES"]
  },
  {
    slug: "case-insensitive",
    name: "scenarios.caseInsensitive.name",
    description: "scenarios.caseInsensitive.description",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["Orchestra", ["cashregister", "Carthorse", "radishes"]],
    expected: ["Carthorse"]
  },
  {
    slug: "not-itself",
    name: "scenarios.notItself.name",
    description: "scenarios.notItself.description",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["BANANA", ["BANANA", "Banana", "banana"]],
    expected: []
  },
  {
    slug: "other-than-itself",
    name: "scenarios.otherThanItself.name",
    description: "scenarios.otherThanItself.description",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["LISTEN", ["Listen", "Silent", "LISTEN"]],
    expected: ["Silent"]
  },
  {
    slug: "alphabetical-sorting",
    name: "scenarios.alphabeticalSorting.name",
    description: "scenarios.alphabeticalSorting.description",
    taskId: "sorted-results",
    functionName: "find_anagrams",
    args: ["stone", ["stone", "tones", "banana", "tons", "notes", "Seton"]],
    expected: ["Seton", "notes", "tones"]
  }
];
