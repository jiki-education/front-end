import type { Task, IOScenario, CodeCheck } from "../types";

// Bonus: reward reaching for a counted for loop, which is the natural way to
// know each digit's position (and therefore which ones to double).
const forLoopCheck: CodeCheck[] = [
  {
    pass: (result) => result.assertors.assertStatement("ForStatement"),
    errorKey: "checks.mustUseFor"
  }
];

export const tasks = [
  {
    id: "double-and-sum" as const,
    name: "tasks.doubleAndSum.name",
    description: "tasks.doubleAndSum.description",
    hints: [],
    requiredScenarios: [
      "luhn-simple-valid",
      "luhn-valid-two-digit",
      "luhn-valid-canadian-sin",
      "luhn-valid-even-digits",
      "luhn-valid-odd-spaces",
      "luhn-valid-multiple-zeros",
      "luhn-valid-digit-nine",
      "luhn-valid-very-long",
      "luhn-valid-odd-digits"
    ],
    bonus: false
  },
  {
    id: "spot-invalid-numbers" as const,
    name: "tasks.spotInvalidNumbers.name",
    description: "tasks.spotInvalidNumbers.description",
    hints: [],
    requiredScenarios: [
      "luhn-invalid-canadian-sin",
      "luhn-invalid-credit-card",
      "luhn-invalid-long-even-remainder",
      "luhn-invalid-long-remainder-div5"
    ],
    bonus: false
  },
  {
    id: "reject-bad-input" as const,
    name: "tasks.rejectBadInput.name",
    description: "tasks.rejectBadInput.description",
    hints: [],
    requiredScenarios: [
      "luhn-single-digit",
      "luhn-single-zero",
      "luhn-zero-with-space",
      "luhn-trailing-letter",
      "luhn-punctuation",
      "luhn-symbols",
      "luhn-letter-in-middle",
      "luhn-colon",
      "luhn-percent"
    ],
    bonus: false
  },
  {
    id: "use-a-for-loop" as const,
    name: "tasks.useAForLoop.name",
    description: "tasks.useAForLoop.description",
    hints: [],
    requiredScenarios: ["luhn-bonus-use-for"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "luhn-simple-valid",
    name: "scenarios.luhnSimpleValid.name",
    description: "scenarios.luhnSimpleValid.description",
    taskId: "double-and-sum",
    functionName: "valid",
    args: ["059"],
    expected: true
  },
  {
    slug: "luhn-valid-two-digit",
    name: "scenarios.luhnValidTwoDigit.name",
    description: "scenarios.luhnValidTwoDigit.description",
    taskId: "double-and-sum",
    functionName: "valid",
    args: ["59"],
    expected: true
  },
  {
    slug: "luhn-valid-canadian-sin",
    name: "scenarios.luhnValidCanadianSin.name",
    description: "scenarios.luhnValidCanadianSin.description",
    taskId: "double-and-sum",
    functionName: "valid",
    args: ["055 444 285"],
    expected: true
  },
  {
    slug: "luhn-valid-even-digits",
    name: "scenarios.luhnValidEvenDigits.name",
    description: "scenarios.luhnValidEvenDigits.description",
    taskId: "double-and-sum",
    functionName: "valid",
    args: ["095 245 88"],
    expected: true
  },
  {
    slug: "luhn-valid-odd-spaces",
    name: "scenarios.luhnValidOddSpaces.name",
    description: "scenarios.luhnValidOddSpaces.description",
    taskId: "double-and-sum",
    functionName: "valid",
    args: ["234 567 891 234"],
    expected: true
  },
  {
    slug: "luhn-valid-multiple-zeros",
    name: "scenarios.luhnValidMultipleZeros.name",
    description: "scenarios.luhnValidMultipleZeros.description",
    taskId: "double-and-sum",
    functionName: "valid",
    args: ["0000 0"],
    expected: true
  },
  {
    slug: "luhn-valid-digit-nine",
    name: "scenarios.luhnValidDigitNine.name",
    description: "scenarios.luhnValidDigitNine.description",
    taskId: "double-and-sum",
    functionName: "valid",
    args: ["091"],
    expected: true
  },
  {
    slug: "luhn-valid-very-long",
    name: "scenarios.luhnValidVeryLong.name",
    description: "scenarios.luhnValidVeryLong.description",
    taskId: "double-and-sum",
    functionName: "valid",
    args: ["9999999999 9999999999 9999999999 9999999999"],
    expected: true
  },
  {
    slug: "luhn-valid-odd-digits",
    name: "scenarios.luhnValidOddDigits.name",
    description: "scenarios.luhnValidOddDigits.description",
    taskId: "double-and-sum",
    functionName: "valid",
    args: ["109"],
    expected: true
  },
  {
    slug: "luhn-invalid-canadian-sin",
    name: "scenarios.luhnInvalidCanadianSin.name",
    description: "scenarios.luhnInvalidCanadianSin.description",
    taskId: "spot-invalid-numbers",
    functionName: "valid",
    args: ["055 444 286"],
    expected: false
  },
  {
    slug: "luhn-invalid-credit-card",
    name: "scenarios.luhnInvalidCreditCard.name",
    description: "scenarios.luhnInvalidCreditCard.description",
    taskId: "spot-invalid-numbers",
    functionName: "valid",
    args: ["8273 1232 7352 0569"],
    expected: false
  },
  {
    slug: "luhn-invalid-long-even-remainder",
    name: "scenarios.luhnInvalidLongEvenRemainder.name",
    description: "scenarios.luhnInvalidLongEvenRemainder.description",
    taskId: "spot-invalid-numbers",
    functionName: "valid",
    args: ["1 2345 6789 1234 5678 9012"],
    expected: false
  },
  {
    slug: "luhn-invalid-long-remainder-div5",
    name: "scenarios.luhnInvalidLongRemainderDiv5.name",
    description: "scenarios.luhnInvalidLongRemainderDiv5.description",
    taskId: "spot-invalid-numbers",
    functionName: "valid",
    args: ["1 2345 6789 1234 5678 9013"],
    expected: false
  },
  {
    slug: "luhn-single-digit",
    name: "scenarios.luhnSingleDigit.name",
    description: "scenarios.luhnSingleDigit.description",
    taskId: "reject-bad-input",
    functionName: "valid",
    args: ["1"],
    expected: false
  },
  {
    slug: "luhn-single-zero",
    name: "scenarios.luhnSingleZero.name",
    description: "scenarios.luhnSingleZero.description",
    taskId: "reject-bad-input",
    functionName: "valid",
    args: ["0"],
    expected: false
  },
  {
    slug: "luhn-zero-with-space",
    name: "scenarios.luhnZeroWithSpace.name",
    description: "scenarios.luhnZeroWithSpace.description",
    taskId: "reject-bad-input",
    functionName: "valid",
    args: [" 0"],
    expected: false
  },
  {
    slug: "luhn-trailing-letter",
    name: "scenarios.luhnTrailingLetter.name",
    description: "scenarios.luhnTrailingLetter.description",
    taskId: "reject-bad-input",
    functionName: "valid",
    args: ["059a"],
    expected: false
  },
  {
    slug: "luhn-punctuation",
    name: "scenarios.luhnPunctuation.name",
    description: "scenarios.luhnPunctuation.description",
    taskId: "reject-bad-input",
    functionName: "valid",
    args: ["055-444-285"],
    expected: false
  },
  {
    slug: "luhn-symbols",
    name: "scenarios.luhnSymbols.name",
    description: "scenarios.luhnSymbols.description",
    taskId: "reject-bad-input",
    functionName: "valid",
    args: ["055# 444$ 285"],
    expected: false
  },
  {
    slug: "luhn-letter-in-middle",
    name: "scenarios.luhnLetterInMiddle.name",
    description: "scenarios.luhnLetterInMiddle.description",
    taskId: "reject-bad-input",
    functionName: "valid",
    args: ["055b 444 285"],
    expected: false
  },
  {
    slug: "luhn-colon",
    name: "scenarios.luhnColon.name",
    description: "scenarios.luhnColon.description",
    taskId: "reject-bad-input",
    functionName: "valid",
    args: [":9"],
    expected: false
  },
  {
    slug: "luhn-percent",
    name: "scenarios.luhnPercent.name",
    description: "scenarios.luhnPercent.description",
    taskId: "reject-bad-input",
    functionName: "valid",
    args: ["59%59"],
    expected: false
  },
  {
    slug: "luhn-bonus-use-for",
    name: "scenarios.luhnBonusUseFor.name",
    description: "scenarios.luhnBonusUseFor.description",
    taskId: "use-a-for-loop",
    functionName: "valid",
    args: ["091"],
    expected: true,
    codeChecks: forLoopCheck
  }
];
