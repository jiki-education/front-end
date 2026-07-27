import type { Task, IOScenario, CodeCheck } from "../types";

// Expanding a run means repeating a character a counted number of times, which is
// the counted `for` loop this level introduces. Enforce it on the final decode
// scenario so a student can't sidestep the construct with, say, a while loop.
const forLoopCheck: CodeCheck[] = [
  {
    pass: (result) => result.assertors.assertStatement("ForStatement"),
    errorKey: "checks.mustUseFor"
  }
];

export const tasks = [
  {
    id: "encode" as const,
    name: "tasks.encode.name",
    description: "tasks.encode.description",
    hints: [],
    requiredScenarios: [
      "rle-encode-empty",
      "rle-encode-singles",
      "rle-encode-no-singles",
      "rle-encode-mixed",
      "rle-encode-whitespace",
      "rle-encode-lowercase"
    ],
    bonus: false
  },
  {
    id: "decode" as const,
    name: "tasks.decode.name",
    description: "tasks.decode.description",
    hints: [],
    requiredScenarios: [
      "rle-decode-empty",
      "rle-decode-singles",
      "rle-decode-no-singles",
      "rle-decode-mixed",
      "rle-decode-whitespace",
      "rle-decode-lowercase"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "rle-encode-empty",
    name: "scenarios.rleEncodeEmpty.name",
    description: "scenarios.rleEncodeEmpty.description",
    taskId: "encode",
    functionName: "encode",
    args: [""],
    expected: ""
  },
  {
    slug: "rle-encode-singles",
    name: "scenarios.rleEncodeSingles.name",
    description: "scenarios.rleEncodeSingles.description",
    taskId: "encode",
    functionName: "encode",
    args: ["XYZ"],
    expected: "XYZ"
  },
  {
    slug: "rle-encode-no-singles",
    name: "scenarios.rleEncodeNoSingles.name",
    description: "scenarios.rleEncodeNoSingles.description",
    taskId: "encode",
    functionName: "encode",
    args: ["AABBBCCCC"],
    expected: "2A3B4C"
  },
  {
    slug: "rle-encode-mixed",
    name: "scenarios.rleEncodeMixed.name",
    description: "scenarios.rleEncodeMixed.description",
    taskId: "encode",
    functionName: "encode",
    args: ["WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWB"],
    expected: "12WB12W3B24WB"
  },
  {
    slug: "rle-encode-whitespace",
    name: "scenarios.rleEncodeWhitespace.name",
    description: "scenarios.rleEncodeWhitespace.description",
    taskId: "encode",
    functionName: "encode",
    args: ["  hsqq qww  "],
    expected: "2 hs2q q2w2 "
  },
  {
    slug: "rle-encode-lowercase",
    name: "scenarios.rleEncodeLowercase.name",
    description: "scenarios.rleEncodeLowercase.description",
    taskId: "encode",
    functionName: "encode",
    args: ["aabbbcccc"],
    expected: "2a3b4c"
  },
  {
    slug: "rle-decode-empty",
    name: "scenarios.rleDecodeEmpty.name",
    description: "scenarios.rleDecodeEmpty.description",
    taskId: "decode",
    functionName: "decode",
    args: [""],
    expected: ""
  },
  {
    slug: "rle-decode-singles",
    name: "scenarios.rleDecodeSingles.name",
    description: "scenarios.rleDecodeSingles.description",
    taskId: "decode",
    functionName: "decode",
    args: ["XYZ"],
    expected: "XYZ"
  },
  {
    slug: "rle-decode-no-singles",
    name: "scenarios.rleDecodeNoSingles.name",
    description: "scenarios.rleDecodeNoSingles.description",
    taskId: "decode",
    functionName: "decode",
    args: ["2A3B4C"],
    expected: "AABBBCCCC"
  },
  {
    slug: "rle-decode-mixed",
    name: "scenarios.rleDecodeMixed.name",
    description: "scenarios.rleDecodeMixed.description",
    taskId: "decode",
    functionName: "decode",
    args: ["12WB12W3B24WB"],
    expected: "WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWB"
  },
  {
    slug: "rle-decode-whitespace",
    name: "scenarios.rleDecodeWhitespace.name",
    description: "scenarios.rleDecodeWhitespace.description",
    taskId: "decode",
    functionName: "decode",
    args: ["2 hs2q q2w2 "],
    expected: "  hsqq qww  "
  },
  {
    slug: "rle-decode-lowercase",
    name: "scenarios.rleDecodeLowercase.name",
    description: "scenarios.rleDecodeLowercase.description",
    taskId: "decode",
    functionName: "decode",
    args: ["2a3b4c"],
    expected: "aabbbcccc",
    codeChecks: forLoopCheck
  }
];
