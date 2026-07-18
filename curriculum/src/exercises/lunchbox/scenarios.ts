import type { Task, IOScenario, CodeCheck } from "../types";

const codeChecks: CodeCheck[] = [
  {
    pass: (result) => result.assertors.countArrayLiterals() === 1,
    errorKey: "checks.oneListOnly"
  },
  {
    pass: (result, language) => {
      // Jikiscript uses push() as a standalone function, not a method call
      if (language === "jikiscript") return true;
      const methodName = language === "python" ? "append" : "push";
      return result.assertors.assertMethodCalled(methodName);
    },
    errorKey: "checks.usePush"
  }
];

export const tasks = [
  {
    id: "pack-a-lunch" as const,
    name: "tasks.packALunch.name",
    description: "tasks.packALunch.description",
    hints: [],
    requiredScenarios: ["regular-lunch", "milkshake-lunch", "another-regular", "another-milkshake"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "regular-lunch",
    name: "scenarios.regularLunch.name",
    description: "scenarios.regularLunch.description",
    taskId: "pack-a-lunch",
    functionName: "pack_a_lunch",
    args: ["ham sandwich", "water", "cookies"],
    expected: ["ham sandwich", "water", "cookies"],
    codeChecks
  },
  {
    slug: "milkshake-lunch",
    name: "scenarios.milkshakeLunch.name",
    description: "scenarios.milkshakeLunch.description",
    taskId: "pack-a-lunch",
    functionName: "pack_a_lunch",
    args: ["PBJ", "milkshake", "grapes"],
    expected: ["PBJ", "grapes"],
    codeChecks
  },
  {
    slug: "another-regular",
    name: "scenarios.anotherRegular.name",
    description: "scenarios.anotherRegular.description",
    taskId: "pack-a-lunch",
    functionName: "pack_a_lunch",
    args: ["turkey wrap", "juice", "chips"],
    expected: ["turkey wrap", "juice", "chips"],
    codeChecks
  },
  {
    slug: "another-milkshake",
    name: "scenarios.anotherMilkshake.name",
    description: "scenarios.anotherMilkshake.description",
    taskId: "pack-a-lunch",
    functionName: "pack_a_lunch",
    args: ["BLT", "milkshake", "apple"],
    expected: ["BLT", "apple"],
    codeChecks
  }
];
