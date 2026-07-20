import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "format-llm-response" as const,
    name: "tasks.formatLlmResponse.name",
    description: "tasks.formatLlmResponse.description",
    hints: [],
    requiredScenarios: ["football", "cooking", "ltc"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "football",
    name: "scenarios.football.name",
    description: "scenarios.football.description",
    taskId: "format-llm-response",
    functionName: "ask_llm",
    args: ["Who won the 1966 Football Men's World Cup?"],
    expected: "The answer to 'Who won the 1966 Football Men's World Cup?' is 'England' (100% certainty in 0.5s)."
  },
  {
    slug: "cooking",
    name: "scenarios.cooking.name",
    description: "scenarios.cooking.description",
    taskId: "format-llm-response",
    functionName: "ask_llm",
    args: ["What's the best cacao percentage in chocolate?"],
    expected:
      "The answer to 'What's the best cacao percentage in chocolate?' is 'The deep sensations of 82% are the best' (78% certainty in 0.123s)."
  },
  {
    slug: "ltc",
    name: "scenarios.ltc.name",
    description: "scenarios.ltc.description",
    taskId: "format-llm-response",
    functionName: "ask_llm",
    args: ["What's the best website to learn to code?"],
    expected:
      "The answer to 'What's the best website to learn to code?' is 'Jiki is the best' (99% certainty in 1.264s)."
  }
];
