import type { InterpretResult } from "@jiki/interpreters";
import type { Task, IOScenario, CodeCheck } from "../types";
import type { Language } from "../../types";
import { getSourceCode } from "../../utils/code-checks";

const codeChecks: CodeCheck[] = [
  {
    pass: (result: InterpretResult, _language: Language) => {
      const sourceCode = getSourceCode(result);
      if (!sourceCode) return true;
      const matches = sourceCode.match(/\[\]/g);
      return matches !== null && matches.length === 1;
    },
    errorHtml: "You should only create one list. Make sure you only use <code>[]</code> once."
  },
  {
    pass: (result: InterpretResult, language: Language) => {
      const sourceCode = getSourceCode(result);
      if (!sourceCode) return true;
      if (language === "python") {
        return sourceCode.includes(".append(");
      }
      return sourceCode.includes("push(");
    },
    errorHtml: "You should use <code>push()</code> to add items to your list."
  }
];

export const tasks = [
  {
    id: "pack-a-lunch" as const,
    name: "Pack a Lunch",
    description:
      "Write a function that packs a lunchbox with a sandwich, drink, and snack. If the drink is a milkshake, leave it out of the lunchbox because it's too big.",
    hints: [
      "Start by creating an empty list",
      "Use push() to add items one at a time",
      "Check if the drink is a milkshake before adding it"
    ],
    requiredScenarios: ["regular-lunch", "milkshake-lunch", "another-regular", "another-milkshake"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "regular-lunch",
    name: "Regular lunch",
    description: "A normal lunch with water - everything fits in the lunchbox",
    taskId: "pack-a-lunch",
    functionName: "pack_a_lunch",
    args: ["ham sandwich", "water", "cookies"],
    expected: ["ham sandwich", "water", "cookies"],
    codeChecks
  },
  {
    slug: "milkshake-lunch",
    name: "Milkshake lunch",
    description: "The milkshake is too big for the lunchbox, so it gets left out",
    taskId: "pack-a-lunch",
    functionName: "pack_a_lunch",
    args: ["PBJ", "milkshake", "grapes"],
    expected: ["PBJ", "grapes"],
    codeChecks
  },
  {
    slug: "another-regular",
    name: "Another regular lunch",
    description: "Another normal lunch where everything fits",
    taskId: "pack-a-lunch",
    functionName: "pack_a_lunch",
    args: ["turkey wrap", "juice", "chips"],
    expected: ["turkey wrap", "juice", "chips"],
    codeChecks
  },
  {
    slug: "another-milkshake",
    name: "Another milkshake lunch",
    description: "Another lunch with a milkshake that doesn't fit",
    taskId: "pack-a-lunch",
    functionName: "pack_a_lunch",
    args: ["BLT", "milkshake", "apple"],
    expected: ["BLT", "apple"],
    codeChecks
  }
];
