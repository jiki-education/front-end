#!/usr/bin/env -S npx tsx

import { readFileSync } from "fs";
import { resolve } from "path";
import { SignJWT } from "jose";

interface Scenario {
  exerciseSlug: string;
  code: string;
  question: string;
  history: { role: "user" | "assistant"; content: string }[];
  language: string;
  nextTaskId?: string;
}

const SCENARIOS: Record<string, Scenario> = {
  "maze-stuck": {
    exerciseSlug: "maze-solve-basic",
    code: `move_right()
move_right()`,
    question: "I'm stuck, I don't know what to do next",
    history: [],
    language: "javascript"
  },
  "isbn-typo": {
    exerciseSlug: "isbn-verifier",
    code: `function isValidIsbn(isbn) {
  let total = 0;
  let num = 0;
  let multiplier = 10;

  for (const char of isbn) {
    if (char === "X" && multiplier === 1) {
      num = 10;
    } else if (char === "-") {
      continue;
    } else if ("0123456789".includes(char)) {
      num = Number(char);
    } else {
      return false;
    }

    total = total + (num * multiplier);
    multiplier = multiplier + 1;
  }

  if (multiplier !== 0) {
    return false;
  }

  return total % 11 === 0;
}`,
    question: "I can't see anything wrong with it",
    history: [
      { role: "user", content: "My code isn't working, can you help?" },
      { role: "assistant", content: "Hi there! I can help you take a look at your `isValidIsbn` function.\n\nIn the warehouse, Jiki has a `multiplier` box. What do you expect to happen to the value in that `multiplier` box each time you process an ISBN character inside your `for` loop? Take a look at the line where you update it." }
    ],
    language: "javascript"
  }
};

// Load secrets from .dev.vars
const devVarsPath = resolve(import.meta.dirname, "../.dev.vars");
const devVars = readFileSync(devVarsPath, "utf-8");
function getVar(name: string): string {
  const match = devVars.match(new RegExp(`${name}=(.+)`));
  if (!match) {
    console.error(`${name} not found in .dev.vars`);
    process.exit(1);
  }
  return match[1].trim();
}
const jwtSecret = getVar("DEVISE_JWT_SECRET_KEY");

// Get scenario from CLI args
const scenarioKey = process.argv[2];

if (!scenarioKey) {
  console.error("Usage: npx tsx bin/sample-llm-response.ts <scenario-key>");
  console.error(`\nAvailable scenarios: ${Object.keys(SCENARIOS).join(", ")}`);
  process.exit(1);
}

const scenario = SCENARIOS[scenarioKey];
if (!scenario) {
  console.error(`Unknown scenario: ${scenarioKey}`);
  console.error(`\nAvailable scenarios: ${Object.keys(SCENARIOS).join(", ")}`);
  process.exit(1);
}

// Generate a valid JWT for the scenario
const secretKey = new TextEncoder().encode(jwtSecret);
const token = await new SignJWT({ exercise_slug: scenario.exerciseSlug })
  .setProtectedHeader({ alg: "HS256" })
  .setSubject("dev-user-1")
  .setExpirationTime("1h")
  .sign(secretKey);

console.log(`\n--- Scenario: ${scenarioKey} ---`);
console.log(`Exercise: ${scenario.exerciseSlug}`);
console.log(`Question: ${scenario.question}`);
console.log(`History: ${scenario.history.length} messages`);
console.log(`\n--- Response ---\n`);

// POST to local wrangler dev server
const response = await fetch("http://localhost:8787/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({
    exerciseSlug: scenario.exerciseSlug,
    code: scenario.code,
    question: scenario.question,
    history: scenario.history,
    language: scenario.language,
    ...(scenario.nextTaskId && { nextTaskId: scenario.nextTaskId })
  })
});

if (!response.ok) {
  console.error(`HTTP ${response.status}: ${await response.text()}`);
  process.exit(1);
}

// Stream the response
const reader = response.body!.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  // Skip signature events, just show the LLM response
  if (text.startsWith("data: ")) continue;
  process.stdout.write(text);
}

console.log("\n");
