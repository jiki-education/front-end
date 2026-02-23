import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "fetch-and-format-time" as const,
    name: "Fetch and format the time",
    description:
      "Write a function that takes a city name, fetches the time data using the API, and returns a formatted time string.",
    hints: [
      "Use fetch with the API URL and a dictionary containing the city",
      "Use concatenate to join the parts of the response into the expected format"
    ],
    requiredScenarios: ["amsterdam", "tokyo", "lima"],
    bonus: false
  },
  {
    id: "handle-errors" as const,
    name: "Handle errors",
    description:
      'Handle error responses gracefully. If the response contains an "error" key, return the error message instead of building the time string.',
    hints: [
      "Check if the response contains an error key before building the string",
      "You can write a hasKey helper function or use the hasKey stdlib function"
    ],
    requiredScenarios: ["error"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "amsterdam",
    name: "Amsterdam",
    description: "Return the time in Amsterdam",
    taskId: "fetch-and-format-time",
    functionName: "get_time",
    args: ["Amsterdam"],
    expected: "The time on this Monday in Amsterdam is 00:28"
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    description: "Return the time in Tokyo",
    taskId: "fetch-and-format-time",
    functionName: "get_time",
    args: ["Tokyo"],
    expected: "The time on this Monday in Tokyo is 08:39"
  },
  {
    slug: "lima",
    name: "Lima",
    description: "Return the time in Lima",
    taskId: "fetch-and-format-time",
    functionName: "get_time",
    args: ["Lima"],
    expected: "The time on this Sunday in Lima is 18:39"
  },
  {
    slug: "error",
    name: "Handle Error",
    description: "Handle an error correctly when the city is not found",
    taskId: "handle-errors",
    functionName: "get_time",
    args: ["London"],
    expected: "Could not determine the time."
  }
];
