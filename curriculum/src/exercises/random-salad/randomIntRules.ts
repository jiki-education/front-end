import type { InterpretResult } from "@jiki/interpreters";

// Shared by the scenario's code checks and the progression metrics, so both
// judge the student's random calls the same way.

type FunctionCallLogEntry = InterpretResult["meta"]["functionCallLog"][number];
type IsRandomCall = (entry: FunctionCallLogEntry) => boolean;

// Returns the arguments of the student's makeSalad() call (leaves, tomatoes, croutons, olives).
export function saladArgs(result: InterpretResult): number[] | undefined {
  const call = result.meta.functionCallLog.find((entry) => entry.name === "makeSalad" || entry.name === "make_salad");
  if (!call || call.args.length !== 4 || !call.args.every((arg) => typeof arg === "number")) return undefined;
  return call.args;
}

export interface RandomIntRule {
  min: number;
  max: number;
  value: number;
}

// The Math.randomInt call each ingredient should come from, given the values
// the student passed to makeSalad().
export function rulesFor([leaves, tomatoes, croutons, olives]: number[]) {
  return {
    leaves: { min: 40, max: 100, value: leaves },
    tomatoes: { min: 5, max: Math.floor(leaves / 5), value: tomatoes },
    croutons: { min: tomatoes, max: tomatoes * 2, value: croutons },
    olives: { min: 1, max: Math.floor(tomatoes / 2), value: olives }
  };
}

// True if every rule has its own Math.randomInt call in the log, with the
// rule's arguments and returning the value the student passed to makeSalad().
// Each log entry can satisfy only one rule, so one call can't stand in for two
// ingredients when their rules happen to have the same arguments and value.
export function allRulesMet(result: InterpretResult, isRandomCall: IsRandomCall, rules: RandomIntRule[]) {
  const unused = result.meta.functionCallLog.filter(isRandomCall);
  return rules.every((rule) => {
    const index = unused.findIndex(
      (entry) =>
        entry.return === rule.value &&
        Math.floor(entry.args[0]) === Math.floor(rule.min) &&
        Math.floor(entry.args[1]) === Math.floor(rule.max)
    );
    if (index === -1) return false;
    unused.splice(index, 1);
    return true;
  });
}

// Each check also needs the rules before it to be met, because later ranges
// depend on earlier values.
export function checkRules(
  result: InterpretResult,
  isRandomCall: IsRandomCall,
  pick: (rules: ReturnType<typeof rulesFor>) => RandomIntRule[]
) {
  const args = saladArgs(result);
  return args !== undefined && allRulesMet(result, isRandomCall, pick(rulesFor(args)));
}
