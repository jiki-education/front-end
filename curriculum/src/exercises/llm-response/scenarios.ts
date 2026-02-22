import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "format-llm-response" as const,
    name: "Format the response",
    description:
      "Create an askLlm function that takes a question, fetches the LLM response, selects the answer with the highest certainty, and returns a formatted string.",
    hints: [
      "Use fetch with the API URL and a dictionary containing the question",
      "Loop through the answers to find the one with the highest certainty",
      "Convert certainty from a decimal string to a percentage (multiply by 100)",
      "Convert time from milliseconds to seconds (divide by 1000)",
      "Use concatenate() to build the result string"
    ],
    requiredScenarios: ["football", "cooking", "ltc"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "football",
    name: "The 1966 World Cup",
    description: "Return the response to a very important question.",
    taskId: "format-llm-response",
    functionName: "ask_llm",
    args: ["Who won the 1966 Football Men's World Cup?"],
    expected: "The answer to 'Who won the 1966 Football Men's World Cup?' is 'England' (100% certainty in 0.5s)."
  },
  {
    slug: "cooking",
    name: "Cooking",
    description: "Return the best response for a cooking question!",
    taskId: "format-llm-response",
    functionName: "ask_llm",
    args: ["What's the best cacao percentage in chocolate?"],
    expected:
      "The answer to 'What's the best cacao percentage in chocolate?' is 'The deep sensations of 82% are the best' (78% certainty in 0.123s)."
  },
  {
    slug: "ltc",
    name: "Learn to Code websites",
    description: "Return the best response for a question with a clear answer!",
    taskId: "format-llm-response",
    functionName: "ask_llm",
    args: ["What's the best website to learn to code?"],
    expected:
      "The answer to 'What's the best website to learn to code?' is 'Exercism is the best' (99% certainty in 1.264s)."
  }
];
