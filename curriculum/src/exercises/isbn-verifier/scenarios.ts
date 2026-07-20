import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "validate-basic-isbn" as const,
    name: "tasks.validateBasicIsbn.name",
    description: "tasks.validateBasicIsbn.description",
    hints: [],
    requiredScenarios: ["isbn-valid"],
    bonus: false
  },
  {
    id: "handle-x-check-digit" as const,
    name: "tasks.handleXCheckDigit.name",
    description: "tasks.handleXCheckDigit.description",
    hints: [],
    requiredScenarios: ["isbn-valid-check-digit-x"],
    bonus: false
  },
  {
    id: "handle-edge-cases" as const,
    name: "tasks.handleEdgeCases.name",
    description: "tasks.handleEdgeCases.description",
    hints: [],
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
    name: "scenarios.isbnValid.name",
    description: "scenarios.isbnValid.description",
    taskId: "validate-basic-isbn",
    functionName: "is_valid_isbn",
    args: ["3-598-21508-8"],
    expected: true
  },
  {
    slug: "isbn-valid-check-digit-x",
    name: "scenarios.isbnValidCheckDigitX.name",
    description: "scenarios.isbnValidCheckDigitX.description",
    taskId: "handle-x-check-digit",
    functionName: "is_valid_isbn",
    args: ["3-598-21507-X"],
    expected: true
  },
  {
    slug: "isbn-valid-no-dashes",
    name: "scenarios.isbnValidNoDashes.name",
    description: "scenarios.isbnValidNoDashes.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3598215088"],
    expected: true
  },
  {
    slug: "isbn-valid-no-dashes-x-check",
    name: "scenarios.isbnValidNoDashesXCheck.name",
    description: "scenarios.isbnValidNoDashesXCheck.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["359821507X"],
    expected: true
  },
  {
    slug: "isbn-invalid-check-digit",
    name: "scenarios.isbnInvalidCheckDigit.name",
    description: "scenarios.isbnInvalidCheckDigit.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3-598-21508-9"],
    expected: false
  },
  {
    slug: "isbn-invalid-character",
    name: "scenarios.isbnInvalidCharacter.name",
    description: "scenarios.isbnInvalidCharacter.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3-598-21507-A"],
    expected: false
  },
  {
    slug: "isbn-invalid-character-not-zero",
    name: "scenarios.isbnInvalidCharacterNotZero.name",
    description: "scenarios.isbnInvalidCharacterNotZero.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["4-598-21507-B"],
    expected: false
  },
  {
    slug: "isbn-invalid-non-numeric",
    name: "scenarios.isbnInvalidNonNumeric.name",
    description: "scenarios.isbnInvalidNonNumeric.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3-598-P1581-X"],
    expected: false
  },
  {
    slug: "isbn-invalid-x-position",
    name: "scenarios.isbnInvalidXPosition.name",
    description: "scenarios.isbnInvalidXPosition.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3-598-2X507-9"],
    expected: false
  },
  {
    slug: "isbn-invalid-missing-check-digit",
    name: "scenarios.isbnInvalidMissingCheckDigit.name",
    description: "scenarios.isbnInvalidMissingCheckDigit.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3-598-21507"],
    expected: false
  },
  {
    slug: "isbn-invalid-too-long",
    name: "scenarios.isbnInvalidTooLong.name",
    description: "scenarios.isbnInvalidTooLong.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3598215078X"],
    expected: false
  },
  {
    slug: "isbn-invalid-too-short",
    name: "scenarios.isbnInvalidTooShort.name",
    description: "scenarios.isbnInvalidTooShort.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["00"],
    expected: false
  },
  {
    slug: "isbn-invalid-empty",
    name: "scenarios.isbnInvalidEmpty.name",
    description: "scenarios.isbnInvalidEmpty.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: [""],
    expected: false
  },
  {
    slug: "isbn-invalid-length-nine",
    name: "scenarios.isbnInvalidLengthNine.name",
    description: "scenarios.isbnInvalidLengthNine.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["134456729"],
    expected: false
  },
  {
    slug: "isbn-invalid-non-numeric-before-check",
    name: "scenarios.isbnInvalidNonNumericBeforeCheck.name",
    description: "scenarios.isbnInvalidNonNumericBeforeCheck.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["3598P215088"],
    expected: false
  },
  {
    slug: "isbn-invalid-extra-length",
    name: "scenarios.isbnInvalidExtraLength.name",
    description: "scenarios.isbnInvalidExtraLength.description",
    taskId: "handle-edge-cases",
    functionName: "is_valid_isbn",
    args: ["98245726788"],
    expected: false
  }
];
