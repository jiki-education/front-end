import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "validate-basic-isbn" as const,
    name: "Validate a basic ISBN",
    description:
      "Write a function called isValidIsbn that takes an ISBN-10 string and returns true if valid, false if not. ISBN-10s contain dashes which should be skipped. Multiply each digit by a weight counting down from 10 to 1, sum them, and check if the total is divisible by 11.",
    hints: [
      "Use a multiplier variable starting at 10, decreasing for each digit processed",
      "Skip dashes using continue"
    ],
    requiredScenarios: ["isbn-valid"],
    bonus: false
  },
  {
    id: "handle-x-check-digit" as const,
    name: "Handle X as a check digit",
    description:
      "Sometimes an ISBN ends with an X, which represents 10. Update your function to handle X in the last position.",
    hints: [
      "X is only valid as the last digit (when multiplier is 1)",
      "When you encounter X in the last position, treat it as the value 10"
    ],
    requiredScenarios: ["isbn-valid-check-digit-x"],
    bonus: false
  },
  {
    id: "handle-edge-cases" as const,
    name: "Handle edge cases",
    description:
      "Make your function robust: handle ISBNs without dashes, reject invalid characters, reject X in non-last positions, and ensure exactly 10 digits are processed.",
    hints: [
      "Return false immediately for any character that isn't a digit, dash, or valid X",
      "After the loop, check that the multiplier is exactly 0 (meaning 10 digits were found)"
    ],
    requiredScenarios: [
      "isbn-valid-no-dashes",
      "isbn-valid-no-dashes-x-check",
      "isbn-invalid-check-digit",
      "isbn-invalid-character",
      "isbn-invalid-character-not-zero",
      "isbn-invalid-non-numeric",
      "isbn-invalid-x-position",
      "isbn-invalid-missing-check-digit",
      "isbn-invalid-too-long",
      "isbn-invalid-too-short",
      "isbn-invalid-empty",
      "isbn-invalid-length-nine",
      "isbn-invalid-non-numeric-before-check",
      "isbn-invalid-extra-length"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "isbn-valid",
    name: "Valid ISBN",
    description: "A valid ISBN-10 should return true.",
    taskId: "validate-basic-isbn",
    functionName: "is_valid_isbn",
    args: ["3-598-21508-8"],
    expected: true
  },
  {
    slug: "isbn-valid-check-digit-x",
    name: "Valid ISBN with X as check digit",
    description: "A valid ISBN-10 with check digit 'X' should return true.",
    taskId: "handle-x-check-digit",
    functionName: "is_valid_isbn",
    args: ["3-598-21507-X"],
    expected: true
  },
  {
    slug: "isbn-valid-no-dashes",
    name: "Valid ISBN without dashes",
    description: "A valid ISBN-10 without separating dashes should return true.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3598215088"],
    expected: true
  },
  {
    slug: "isbn-valid-no-dashes-x-check",
    name: "Valid ISBN without dashes and X as check digit",
    description: "A valid ISBN-10 without dashes and check digit 'X' should return true.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["359821507X"],
    expected: true
  },
  {
    slug: "isbn-invalid-check-digit",
    name: "Invalid ISBN check digit",
    description: "An ISBN-10 with an incorrect check digit should return false.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3-598-21508-9"],
    expected: false
  },
  {
    slug: "isbn-invalid-character",
    name: "Check digit is a character other than X",
    description: "An ISBN-10 containing an invalid character should return false.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3-598-21507-A"],
    expected: false
  },
  {
    slug: "isbn-invalid-character-not-zero",
    name: "Invalid check digit not treated as zero",
    description: "An invalid check digit should not be treated as zero.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["4-598-21507-B"],
    expected: false
  },
  {
    slug: "isbn-invalid-non-numeric",
    name: "Invalid character in ISBN",
    description: "Invalid characters in ISBN should not be ignored.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3-598-P1581-X"],
    expected: false
  },
  {
    slug: "isbn-invalid-x-position",
    name: "X only valid as a check digit",
    description: "An 'X' should only be valid as a check digit.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3-598-2X507-9"],
    expected: false
  },
  {
    slug: "isbn-invalid-missing-check-digit",
    name: "ISBN without check digit",
    description: "An ISBN-10 without a check digit should return false.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3-598-21507"],
    expected: false
  },
  {
    slug: "isbn-invalid-too-long",
    name: "Too long ISBN",
    description: "An ISBN-10 that is too long should return false.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3598215078X"],
    expected: false
  },
  {
    slug: "isbn-invalid-too-short",
    name: "Too short ISBN",
    description: "An ISBN-10 that is too short should return false.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["00"],
    expected: false
  },
  {
    slug: "isbn-invalid-empty",
    name: "Empty ISBN",
    description: "An empty ISBN string should return false.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: [""],
    expected: false
  },
  {
    slug: "isbn-invalid-length-nine",
    name: "ISBN is 9 characters",
    description: "An input with 9 characters should return false.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["134456729"],
    expected: false
  },
  {
    slug: "isbn-invalid-non-numeric-before-check",
    name: "Invalid character before checking length",
    description: "Invalid characters should not be ignored before checking length.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3598P215088"],
    expected: false
  },
  {
    slug: "isbn-invalid-extra-length",
    name: "Input too long but contains a valid ISBN",
    description: "An input longer than 10 characters should return false.",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["98245726788"],
    expected: false
  }
];
