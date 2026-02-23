import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "encode-message" as const,
    name: "Encode a message",
    description:
      "Write an encode function that shifts each letter in a message by a given amount. Spaces should remain as spaces. Letters that shift past 'z' should wrap around to the beginning of the alphabet.",
    hints: [
      "Start by writing a helper function to find the position of a letter in the alphabet",
      "Write another helper function to shift a single letter by the given amount",
      "Use the modulo operator (%) to handle wrap-around",
      "Build the final encode function by iterating through each character"
    ],
    requiredScenarios: [
      "caesar-simple-shift",
      "caesar-shift-by-3",
      "caesar-wrap-around",
      "caesar-with-spaces",
      "caesar-rot13"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "caesar-simple-shift",
    name: "Simple shift by 1",
    description: "Shift each letter forward by 1: a->b, b->c, c->d.",
    taskId: "encode-message",
    functionName: "encode",
    args: ["abc", 1],
    expected: "bcd"
  },
  {
    slug: "caesar-shift-by-3",
    name: "Shift by 3",
    description: "Shift each letter forward by 3: h->k, e->h, l->o, o->r.",
    taskId: "encode-message",
    functionName: "encode",
    args: ["hello", 3],
    expected: "khoor"
  },
  {
    slug: "caesar-wrap-around",
    name: "Wrap around the alphabet",
    description: "When shifting goes past 'z', it wraps around: x->a, y->b, z->c.",
    taskId: "encode-message",
    functionName: "encode",
    args: ["xyz", 3],
    expected: "abc"
  },
  {
    slug: "caesar-with-spaces",
    name: "Message with spaces",
    description: "Spaces should remain as spaces, only letters are shifted.",
    taskId: "encode-message",
    functionName: "encode",
    args: ["hello world", 5],
    expected: "mjqqt btwqi"
  },
  {
    slug: "caesar-rot13",
    name: "ROT13 encryption",
    description: "ROT13 is a special case of the Caesar cipher with a shift of 13.",
    taskId: "encode-message",
    functionName: "encode",
    args: ["attack at dawn", 13],
    expected: "nggnpx ng qnja"
  }
];
