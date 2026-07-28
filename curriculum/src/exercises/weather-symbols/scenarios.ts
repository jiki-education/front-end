import type { Task, VisualScenario } from "../types";
import type { WeatherSymbolsExercise } from "./Exercise";

// The symbols each weather description maps to. This is the mapping the student
// encodes as array literals; it's the source of truth for what each box should
// show. Kept here (not in the Exercise) because the Exercise only ever receives
// already-resolved symbol lists.
const SYMBOLS: Record<string, string[]> = {
  "Sunny ☀️": ["sun"],
  "Dull 😴": ["cloud"],
  "Miserable 😩": ["cloud", "rain"],
  "Hopeful 🤞": ["sun", "cloud"],
  "Rainbow territory! 🌈": ["sun", "cloud", "rain"],
  "Exciting 🤩": ["cloud", "snow"],
  "Snowboarding time! 🏂": ["sun", "cloud", "snow"]
};

export const tasks = [
  {
    id: "draw-forecast" as const,
    name: "tasks.drawForecast.name",
    description: "tasks.drawForecast.description",
    hints: [],
    requiredScenarios: ["mixed-week", "sunny-week", "rainy-week", "snowy-week"],
    bonus: false
  }
] as const satisfies readonly Task[];

// Builds one expectation per day: box `i` must show the symbols that day's
// description maps to. Errors point at the day, never at coordinates.
function forecastExpectations(days: string[]) {
  return (exercise: WeatherSymbolsExercise) =>
    days.map((day, i) => ({
      pass: exercise.hasWeatherAt(i, SYMBOLS[day]),
      errorHtml: exercise.t("checks.dayIsntCorrect", { day: i + 1 })
    }));
}

function forecastScenario(slug: string, days: string[]): VisualScenario {
  return {
    slug,
    name: `scenarios.${camelize(slug)}.name`,
    description: `scenarios.${camelize(slug)}.description`,
    taskId: "draw-forecast",
    functionCall: { name: "draw_forecast", args: [days] },
    expectations: (exercise) => forecastExpectations(days)(exercise as WeatherSymbolsExercise)
  };
}

function camelize(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export const scenarios: VisualScenario[] = [
  forecastScenario("mixed-week", [
    "Sunny ☀️",
    "Dull 😴",
    "Miserable 😩",
    "Hopeful 🤞",
    "Exciting 🤩",
    "Snowboarding time! 🏂"
  ]),
  forecastScenario("sunny-week", ["Sunny ☀️", "Sunny ☀️", "Hopeful 🤞", "Sunny ☀️", "Hopeful 🤞", "Sunny ☀️"]),
  forecastScenario("rainy-week", [
    "Miserable 😩",
    "Rainbow territory! 🌈",
    "Miserable 😩",
    "Dull 😴",
    "Miserable 😩",
    "Hopeful 🤞"
  ]),
  forecastScenario("snowy-week", [
    "Exciting 🤩",
    "Snowboarding time! 🏂",
    "Exciting 🤩",
    "Dull 😴",
    "Snowboarding time! 🏂",
    "Exciting 🤩"
  ])
];
