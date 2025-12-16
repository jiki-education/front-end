import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "find-anagrams" as const,
    name: "Find Anagrams",
    description:
      "Write a function that finds all anagrams of a target word from a list of possibilities. An anagram uses the same letters rearranged. The function should be case-insensitive, exclude the target word itself, and return results sorted alphabetically.",
    hints: [
      "Compare sorted versions of lowercase strings to detect anagrams",
      "Use a loop to check each possibility against the target",
      "Filter out exact matches (case-insensitive) of the target word",
      "Build your result list using push()",
      "Sort the final results before returning"
    ],
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
    name: "Alphabetical Sorting",
    description: "Ensure your results are returned in alphabetical order (bonus challenge).",
    hints: [
      "Implement a custom sorting function to order the results",
      "Compare the first characters of each word to determine order"
    ],
    requiredScenarios: ["alphabetical-sorting"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "no-matches",
    name: "No matches",
    description: "If no anagrams exist in the candidates, return an empty list",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["diaper", ["hello", "world", "zombies", "pants"]],
    expected: []
  },
  {
    slug: "two-anagrams",
    name: "Detects two anagrams",
    description: "Find two anagrams from a list of candidates",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["master", ["maters", "stream", "pigeon"]],
    expected: ["maters", "stream"]
  },
  {
    slug: "no-subsets",
    name: "Does not detect anagram subsets",
    description: "An anagram must use all letters exactly once",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["good", ["dog", "goody"]],
    expected: []
  },
  {
    slug: "single-match",
    name: "Detects single anagram",
    description: "Find a single anagram from a list",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["listen", ["enlists", "google", "inlets", "banana"]],
    expected: ["inlets"]
  },
  {
    slug: "different-case",
    name: "Detects multiple anagrams with different case",
    description: "Anagrams should be detected regardless of case",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["nose", ["Eons", "ONES"]],
    expected: ["Eons", "ONES"]
  },
  {
    slug: "case-insensitive",
    name: "Detects anagrams case-insensitively",
    description: "Case should not affect anagram detection",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["Orchestra", ["cashregister", "Carthorse", "radishes"]],
    expected: ["Carthorse"]
  },
  {
    slug: "not-itself",
    name: "Words are not anagrams of themselves (case-insensitive)",
    description: "A word should not be considered an anagram of itself",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["BANANA", ["BANANA", "Banana", "banana"]],
    expected: []
  },
  {
    slug: "other-than-itself",
    name: "Words other than themselves can be anagrams",
    description: "Detect valid anagrams excluding the target word itself",
    taskId: "find-anagrams",
    functionName: "find_anagrams",
    args: ["LISTEN", ["Listen", "Silent", "LISTEN"]],
    expected: ["Silent"]
  },
  {
    slug: "alphabetical-sorting",
    name: "Results sorted alphabetically",
    description: "Verify anagrams are returned in alphabetical order",
    taskId: "sorted-results",
    functionName: "find_anagrams",
    args: ["stone", ["stone", "tones", "banana", "tons", "notes", "Seton"]],
    expected: ["Seton", "notes", "tones"]
  }
];
