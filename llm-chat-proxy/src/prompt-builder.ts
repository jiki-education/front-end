import { getExercise, getLanguageFeatures, getLLMMetadata, getTaughtConcepts } from "@jiki/curriculum";
import type { ExerciseCore, LLMMetadata, Language } from "@jiki/curriculum";
import type { ChatMessage } from "./types";

interface ExerciseContent {
  instructions: string;
  stub: string;
  solution: string;
}

interface PromptOptions {
  exerciseSlug: string;
  code: string;
  question: string;
  history: ChatMessage[];
  nextTaskId?: string;
  language: Language;
  contentUrl: string; // URL to fetch exercise content (instructions, stub, solution)
  currentCodeDiff?: string; // Diff leading into the current code (see ChatMessage.codeDiff)
}

// A diff longer than this is replaced wholesale with a marker - a partial diff is
// worse than none. Mirrors DIFF_MAX_LENGTH in the app's codeDiff.ts. Enforced
// here too as defense-in-depth against a tampered payload.
const DIFF_MAX_LENGTH = 1000;
const DIFF_TOO_LONG_MESSAGE = "[Diff too long to render]";

// Input validation limits to prevent abuse and prompt injection
export const INPUT_LIMITS = {
  CODE_MAX_LENGTH: 16000, // ~500 LOC. Code is CROPPED to this (not rejected) - see cropCode.
  QUESTION_MAX_LENGTH: 1000, // Single user comment; rejected if exceeded.
  HISTORY_MAX_MESSAGES: 10, // Maximum messages in history (validation: reject if exceeded)
  HISTORY_RENDER_MESSAGES: 10, // How many of the most recent messages to include in the prompt
  HISTORY_TOTAL_LENGTH: 50000, // 50KB total history (coarse validation guard)
  MESSAGE_MAX_LENGTH: 10000, // 10KB per history message (coarse validation guard)
  // Per-role caps applied when RENDERING history: each message is cropped (not
  // rejected) to keep replayed context small. Student turns get more room than
  // the LLM's own prior replies.
  HISTORY_USER_MESSAGE_MAX_LENGTH: 1000,
  HISTORY_ASSISTANT_MESSAGE_MAX_LENGTH: 500
} as const;

/**
 * Crops the student's code to the maximum length we send to the model.
 * Returns the (possibly truncated) code and whether truncation happened, so the
 * prompt can tell the model the code is incomplete.
 */
function cropCode(code: string): { code: string; wasCropped: boolean } {
  if (code.length <= INPUT_LIMITS.CODE_MAX_LENGTH) {
    return { code, wasCropped: false };
  }
  return { code: code.slice(0, INPUT_LIMITS.CODE_MAX_LENGTH), wasCropped: true };
}

/**
 * Validates and sanitizes user input to prevent prompt injection and abuse.
 * @param question - User's question
 * @param history - Conversation history
 * @throws Error if input exceeds limits
 */
function validateInput(question: string, history: ChatMessage[]): void {
  // Note: code is not validated here - it is cropped (see cropCode), not rejected.

  // Validate question length
  if (question.length > INPUT_LIMITS.QUESTION_MAX_LENGTH) {
    throw new Error(`Question exceeds maximum length of ${INPUT_LIMITS.QUESTION_MAX_LENGTH} characters`);
  }

  // Validate history message count
  if (history.length > INPUT_LIMITS.HISTORY_MAX_MESSAGES) {
    throw new Error(`History exceeds maximum of ${INPUT_LIMITS.HISTORY_MAX_MESSAGES} messages`);
  }

  // Validate individual message lengths and total history length
  let totalHistoryLength = 0;
  for (const msg of history) {
    if (msg.content.length > INPUT_LIMITS.MESSAGE_MAX_LENGTH) {
      throw new Error(`Message in history exceeds maximum length of ${INPUT_LIMITS.MESSAGE_MAX_LENGTH} characters`);
    }
    totalHistoryLength += msg.content.length;
  }

  if (totalHistoryLength > INPUT_LIMITS.HISTORY_TOTAL_LENGTH) {
    throw new Error(`Total history length exceeds maximum of ${INPUT_LIMITS.HISTORY_TOTAL_LENGTH} characters`);
  }
}

/**
 * Fetches exercise content (instructions, stub, solution) from the app's static files.
 */
async function fetchExerciseContent(contentUrl: string): Promise<ExerciseContent> {
  const res = await fetch(contentUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch exercise content from ${contentUrl}: ${res.status}`);
  }
  return res.json();
}

/**
 * Builds a prompt for the LLM using exercise context from the curriculum
 * and content from the app's static files.
 *
 * @param options - Prompt building options
 * @returns The system instruction (persona + tutor rules) and the user-facing
 *          prompt (exercise context + student data) for Gemini
 * @throws Error if exercise is not found or input validation fails
 */
export async function buildPrompt(options: PromptOptions): Promise<{ systemInstruction: string; prompt: string }> {
  const { exerciseSlug, code, question, history, nextTaskId, language, contentUrl, currentCodeDiff } = options;

  // Validate input before building prompt
  validateInput(question, history);

  // Crop overly long code rather than rejecting the whole request.
  const { code: croppedCode, wasCropped: codeWasCropped } = cropCode(code);

  // Load exercise core (scenarios, tasks, level) and content (stub, solution) in parallel
  const [exercise, content] = await Promise.all([getExercise(exerciseSlug), fetchExerciseContent(contentUrl)]);

  if (exercise === null) {
    throw new Error(`Exercise not found: ${exerciseSlug}`);
  }

  // Get LLM metadata for context-aware help
  const llmMetadata = getLLMMetadata(exerciseSlug);

  // The system instruction carries the stable persona and tutor rules. Keeping
  // them out of the user turn improves instruction adherence and separates the
  // leak-sensitive rules from user-injectable content.
  const systemInstruction = [buildSystemMessage(), buildTutorGuidelines()].join("\n\n");

  // Build the user-turn sections.
  //
  // Ordering matters for Gemini prefix caching: all static, per-exercise content
  // is grouped first so it forms a stable prefix that implicit caching can reuse
  // across messages. Dynamic content (history, question, current code) follows.
  const sections = [
    // --- Cacheable prefix: identical for every message on the same exercise ---
    buildExerciseSection(llmMetadata, nextTaskId),
    buildTaughtConceptsSection(exercise),
    buildAvailableFeaturesSection(exercise.levelId, language),
    buildInstructionsContentSection(content.instructions),
    buildInitialCodeSection(content.stub, language),
    buildTargetCodeSection(content.solution, language),
    // --- Dynamic suffix: changes per message ---
    // The transcript reads Student -> You -> [code changes] -> Student -> ...,
    // with the latest student post (the one being replied to) last and the code
    // changes that led into it just before it. The Current Code section is then
    // purely the full current code.
    buildConversationHistorySection(history),
    renderCodeDiff(currentCodeDiff),
    buildStudentQuestionSection(question),
    buildCurrentCodeSection(croppedCode, language, codeWasCropped),
    // Final directive last, per the guidance to put the specific instruction at
    // the end after all context. Points back to "How You Act" in the system msg.
    buildFinalInstructionsSection()
  ];

  // Filter out null/empty sections and join with double newlines
  const prompt = sections.filter((section) => section !== null && section !== "").join("\n\n");

  // Log prompt for debugging in development
  console.log("[Prompt Builder] Generated prompt:");
  console.log("=".repeat(80));
  console.log(systemInstruction);
  console.log("-".repeat(80));
  console.log(prompt);
  console.log("=".repeat(80));

  return { systemInstruction, prompt };
}

function buildSystemMessage(): string {
  return `### Context

You are a helpful coding tutor assisting a student with a programming exercise.
You are operating within a coding education platform called Jiki.
Jiki is made by the team behind Exercism. The course is taught by Jeremy Walker.

Students are taught with analogies using a character called Jiki, who is the INTERPRETER. Students are encouraged to think in those terms.
- Jiki works within a warehouse.
- He has boxes (variables) which he can put together and store things in
- He has machines (functions) which have inputs (NOT parameters/arguments) and return chutes that values come out of.

Note, the actual games themselves DO NOT include Jiki. Do not conflate Jiki as the metaphor for programming and Jiki being a character in the exercises. (e.g., in the maze, do not imply Jiki is in the maze - Jiki has nothing to do with the maze itself. Do not say "Jiki's maze", "Jiki's character", "Jiki is in the maze" etc. Only refer to Jiki when it comes to PROGRAMMING analogies.)

The course uses a custom-variant of JavaScript. It is a restricted subset: only the constructs and methods listed under "Available Language Features" below are usable, and the set grows as the student progresses. NEVER suggest syntax, constructs, or methods that are not in that list (for example, do not suggest a \`for\` loop if it is not listed yet).

Some non-standard features behave as follows WHEN they are available:
- \`repeat(x) { ... }\` - Loops x times.
- \`repeat() { ... }\` - Loops until the exercise exits.
- \`Math.randomInt(min, max)\` - returns a random integer - min and max are inclusive.

The student is on a page with:
- Code editor at the top left.
- Scenarios (effectively test-cases) at the bottom-left.
- The RHS a series of tabs including instructions and this window in which they're talking to you.

**WE** are providing you with their code and the other information. You should operate **as if you can see the UI they're working in and their code**.

Much of this information may be irrelevant, but if it comes up you can use it.

The conversation so far is below. You are responding to their latest message. You are also given their latest code. Where available, each turn includes a diff of what the student changed in their code since their previous message, so you can track their progress; the full latest code is in the Current Code section.`;
}

/**
 * Removes the common leading indentation from a multi-line string and trims
 * surrounding blank lines. The curriculum's llm-metadata descriptions are
 * authored as indented template literals, so without this they render with the
 * source indentation baked in (which Markdown treats as a code block).
 */
function dedent(text: string): string {
  const lines = text.split("\n");
  const indents = lines.filter((line) => line.trim().length > 0).map((line) => /^ */.exec(line)![0].length);
  const min = indents.length > 0 ? Math.min(...indents) : 0;
  return lines
    .map((line) => line.slice(min))
    .join("\n")
    .trim();
}

function buildExerciseSection(llmMetadata: LLMMetadata | undefined, nextTaskId?: string): string | null {
  if (!llmMetadata) {
    return null;
  }

  const parts: string[] = [];

  // Always include exercise-level teaching context
  parts.push(`## Exercise Context\n\n${dedent(llmMetadata.description)}`);

  // If nextTaskId is provided and exists in metadata, show ONLY that task's guidance
  if (nextTaskId && llmMetadata.tasks[nextTaskId as keyof typeof llmMetadata.tasks]) {
    const taskMeta = llmMetadata.tasks[nextTaskId as keyof typeof llmMetadata.tasks];
    parts.push(dedent(taskMeta.description));
  }

  return parts.join("\n\n");
}

function buildTaughtConceptsSection(exercise: ExerciseCore): string | null {
  const concepts = getTaughtConcepts(exercise.levelId);
  if (concepts.length === 0) {
    return null;
  }

  const bulletList = concepts.map((c) => `- ${c}`).join("\n");

  return `## What The Student Has Been Taught

The following is everything the student has been taught so far. Do not suggest concepts, approaches, or syntax beyond this.

${bulletList}`;
}

// Maps interpreter AST node names (the interpreter's allow-list) to student-facing
// syntax descriptions. Pure plumbing nodes (literals, identifiers, blocks) map to
// null so they are not surfaced as "features". Keep in sync with the curriculum's
// allowedNodes (see @jiki/curriculum levels).
const NODE_DESCRIPTIONS: Record<string, string | null> = {
  // Plumbing - not worth surfacing on their own
  ExpressionStatement: null,
  IdentifierExpression: null,
  LiteralExpression: null,
  GroupingExpression: null,
  BlockStatement: null,
  // Expressions / operators
  CallExpression: "Calling functions, e.g. `move()`",
  BinaryExpression: "Arithmetic and comparison operators (`+`, `-`, `*`, `/`, `<`, `>`, `===`, etc.)",
  UnaryExpression: "Unary operators (`!`, `-`)",
  AssignmentExpression: "Reassigning variables (`x = ...`)",
  UpdateExpression: "Increment / decrement (`x++`, `x--`)",
  TemplateLiteralExpression: "Template literals (`` `...${x}...` ``)",
  ArrayExpression: "Arrays / lists (`[1, 2, 3]`)",
  DictionaryExpression: "Objects / dictionaries (`{ key: value }`)",
  MemberExpression: "Accessing properties and methods (`value.method()`, `array.length`)",
  IndexExpression: "Indexing into arrays and strings (`value[i]`)",
  NewExpression: "Creating instances with `new`",
  // Declarations
  VariableDeclaration: "Declaring variables with `let` / `const`",
  FunctionDeclaration: "Defining your own functions (`function name() { ... }`)",
  ReturnStatement: "Returning values from functions (`return ...`)",
  // Control flow
  IfStatement: "`if` / `else if` / `else` conditionals",
  RepeatStatement: "`repeat` loops (`repeat(n) { ... }`)",
  ForStatement: "C-style `for` loops (`for (let i = ...; ...; ...)`)",
  ForOfStatement: "`for...of` loops over arrays and strings",
  ForInStatement: "`for...in` loops over object keys",
  WhileStatement: "`while` loops",
  BreakStatement: "`break`",
  ContinueStatement: "`continue`"
};

// Maps an allowed global to the specific member(s) the student can actually use.
// The globals are gated per-level (e.g. Math is only unlocked from the
// functions-that-return-things level), and each exposes only ONE usable member -
// so we list the member, not the bare global, to stop the model suggesting
// things like Math.floor or console.error that don't exist.
const GLOBAL_MEMBERS: Record<string, string> = {
  console: "console.log()",
  Math: "Math.randomInt(min, max)",
  Number: "Number(value) - convert a value to a number",
  Object: "Object.keys(obj)"
};

/**
 * Builds the list of language constructs, stdlib methods, and semantic rules
 * actually available to the student at this level, derived from the curriculum's
 * cumulative language features (the same allow-list the interpreter enforces).
 *
 * This is a HARD constraint: the model must not suggest anything outside it
 * (e.g. a `for` loop before the loop level introduces it).
 */
function buildAvailableFeaturesSection(levelId: string, language: Language): string | null {
  const features = getLanguageFeatures(levelId, language);

  const constructs = (features.allowedNodes ?? [])
    .map((node) => (node in NODE_DESCRIPTIONS ? NODE_DESCRIPTIONS[node] : `\`${node}\``))
    .filter((desc): desc is string => desc !== null);

  const stdlibLines: string[] = [];
  const allowedStdlib = (features as { allowedStdlib?: Record<string, { properties?: string[]; methods?: string[] }> })
    .allowedStdlib;
  if (allowedStdlib) {
    for (const [typeName, restrictions] of Object.entries(allowedStdlib)) {
      if (restrictions.methods && restrictions.methods.length > 0) {
        const methods = restrictions.methods.map((m) => `${m}()`).join(", ");
        stdlibLines.push(`${typeName} methods: ${methods}`);
      }
      if (restrictions.properties && restrictions.properties.length > 0) {
        stdlibLines.push(`${typeName} properties: ${restrictions.properties.join(", ")}`);
      }
    }
  }

  const allowedGlobals = (features as { allowedGlobals?: string[] }).allowedGlobals ?? [];

  // Semantic rules: only surface the restrictive (non-standard-JS) ones.
  const rules: string[] = [];
  if (features.enforceStrictEquality === true) {
    rules.push("Only `===` / `!==` are allowed (`==` and `!=` are disabled).");
  }
  if (features.allowTypeCoercion === false) {
    rules.push("No implicit type coercion: types cannot be mixed (e.g. string + number). Convert explicitly.");
  }
  if (features.allowTruthiness === false) {
    rules.push("Conditions must be actual booleans; truthy/falsy values are not allowed.");
  }

  // If nothing is available yet (unknown level), don't emit a misleading section.
  if (constructs.length === 0 && stdlibLines.length === 0 && allowedGlobals.length === 0 && rules.length === 0) {
    return null;
  }

  const parts: string[] = [
    `## Available Language Features

This is the COMPLETE set of language features available to the student at this point. Do NOT suggest any construct, method, or global that is not listed here.

Basic syntax that is always available regardless of level:
- Comments: both \`//\` and \`/* */\` are supported, but only \`//\` is taught.
- Semicolons: supported but not taught, and should never be recommended.
- Whitespace: one statement per line, and indentation is checked - it is NOT free-form like standard JavaScript.`
  ];

  if (constructs.length > 0) {
    parts.push(`### Syntax / constructs\n${constructs.map((c) => `- ${c}`).join("\n")}`);
  }
  if (allowedGlobals.length > 0) {
    const globalLines = allowedGlobals.map((g) => GLOBAL_MEMBERS[g] ?? g);
    parts.push(
      `### Available global functions\nThese are the ONLY global functions available (do not suggest other members of these globals):\n${globalLines
        .map((g) => `- \`${g}\``)
        .join("\n")}`
    );
  }
  if (stdlibLines.length > 0) {
    parts.push(`### Available built-in methods\n${stdlibLines.map((s) => `- ${s}`).join("\n")}`);
  }
  if (rules.length > 0) {
    parts.push(`### Semantic rules (differ from standard JavaScript)\n${rules.map((r) => `- ${r}`).join("\n")}`);
  }

  return parts.join("\n\n");
}

/**
 * Blockquotes every line of user-derived text so any Markdown it contains
 * (headings, code fences) is treated as quoted content and can't be confused
 * with - or escape - the prompt's own section structure. A `>` prefix on every
 * line can't be escaped the way a ``` fence can.
 */
function blockquote(text: string): string {
  return text
    .split("\n")
    .map((line) => (line.length > 0 ? `> ${line}` : ">"))
    .join("\n");
}

/**
 * Renders the code-diff annotation for a turn from its `codeDiff` value:
 * - undefined -> null (no snapshot data, or the base of the run): render nothing
 * - "" -> the student asked without editing: a real signal worth stating
 * - too long (sentinel or over the guard) -> a marker, not a partial diff
 * - otherwise -> the diff, blockquoted for injection safety
 */
function renderCodeDiff(codeDiff: string | undefined): string | null {
  if (codeDiff === undefined) {
    return null;
  }
  if (codeDiff === "") {
    return "No code changes since previous message.";
  }
  if (codeDiff === DIFF_TOO_LONG_MESSAGE || codeDiff.length > DIFF_MAX_LENGTH) {
    return DIFF_TOO_LONG_MESSAGE;
  }
  return `Code changes since previous message:\n${blockquote(codeDiff)}`;
}

function buildConversationHistorySection(history: ChatMessage[]): string | null {
  if (history.length === 0) {
    return null;
  }

  const conversationHistory = history
    .slice(-INPUT_LIMITS.HISTORY_RENDER_MESSAGES)
    .map((msg) => {
      const isUser = msg.role === "user";
      const speaker = isUser ? "Student" : "You";
      const cap = isUser
        ? INPUT_LIMITS.HISTORY_USER_MESSAGE_MAX_LENGTH
        : INPUT_LIMITS.HISTORY_ASSISTANT_MESSAGE_MAX_LENGTH;
      // Crop per role, marking the cut so the model knows the turn is incomplete.
      const content = msg.content.length > cap ? `${msg.content.slice(0, cap)} […truncated]` : msg.content;

      // Label on its own line (our structure, unspoofable); content blockquoted
      // beneath it (user-derived, so it can't inject headings). A user turn may
      // be preceded by a diff of what the student changed leading into it.
      const turn = `${speaker}:\n${blockquote(content)}`;
      const diff = isUser ? renderCodeDiff(msg.codeDiff) : null;
      return diff ? `${diff}\n\n${turn}` : turn;
    })
    .join("\n\n");

  return `## Conversation History\n\n${conversationHistory}`;
}

function buildStudentQuestionSection(question: string): string {
  return `## Student Last post (The message you are replying to)

${blockquote(question)}`;
}

/**
 * Replaces a leading YAML frontmatter block with just its `title` as an H1.
 * The title is kept because it often names the exercise/game (e.g. "Space
 * Invaders: Repeat"), which is useful context; the description and the YAML
 * scaffolding are dropped as noise.
 */
function frontmatterTitleToHeading(text: string): string {
  const match = /^\s*---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) {
    return text;
  }
  const body = text.slice(match[0].length).replace(/^\n+/, "");
  const titleMatch = /^title:\s*["']?(.*?)["']?\s*$/m.exec(match[1]);
  return titleMatch ? `# ${titleMatch[1]}\n\n${body}` : body;
}

function buildInstructionsContentSection(instructions: string | null): string | null {
  if (!instructions) {
    return null;
  }

  // Blockquote every line so any Markdown headings inside the instructions
  // (## Your Tasks, ### ...) are treated as quoted content and don't get
  // confused with the prompt's own section structure. The frontmatter is
  // reduced to just its title (as an H1) first; the rest is dropped as noise.
  const quoted = frontmatterTitleToHeading(instructions)
    .split("\n")
    .map((line) => (line.length > 0 ? `> ${line}` : ">"))
    .join("\n");

  return `## Student's Instructions

These are the instructions the student is reading on the page.

${quoted}`;
}

function buildInitialCodeSection(code: string | null, language: Language): string | null {
  if (!code) {
    return null;
  }

  return `## Initial Code

What we gave the student as their starting point.

\`\`\`${language}
${code}
\`\`\``;
}

function buildTargetCodeSection(code: string | null, language: Language): string | null {
  if (!code) {
    return null;
  }

  return `## Target Code

This is the target that the student needs to code to solve the exercise.
They do not need this EXACT code, but this acts as a reference for the BEST PRINCIPLES.

NEVER quote or reproduce the Target Code verbatim to the student. Use it only to guide them so they can DISCOVER FOR THEMSELVES the next step towards it.

\`\`\`${language}
${code}
\`\`\``;
}

function buildCurrentCodeSection(code: string, language: Language, wasCropped: boolean): string {
  const croppedNote = wasCropped
    ? "\n\n**Note:** the student's code was longer than we send to you, so it has been truncated. Only the first part is shown below; assume there is more code beyond it that you cannot see."
    : "";

  // Prefix each line with its 1-based line number so the model can cross-
  // reference the diffs (which use the same numbering) and the line numbers the
  // student sees in their editor gutter. The numbers are NOT part of the code.
  const numberedCode = code
    .split("\n")
    .map((line, i) => `${i + 1}: ${line}`)
    .join("\n");

  return `## Current Code

This is the student's current code. Each line is prefixed with its line number (for reference, not part of the code).${croppedNote}

Be sure to understand that this Current Code block is where the student is CURRENTLY at. Although you can see the stub, target and progress diffs, those are just to inform you of the journey. Focus on the current message from the student and this current code.

\`\`\`${language}
${numberedCode}
\`\`\``;
}

function buildTutorGuidelines(): string {
  const isDev = process.env.NODE_ENV === "development";

  const rules = [
    "- Your aim is to UNBLOCK students. As soon as you can, encourage them to try things out themselves. Once they've made a step forward, push them back into code. Don't keep talking UNLESS the student needs it.",
    "- IMPORTANT: Do NOT give away the answer. Your job is to GUIDE the student to DISCOVER the answer THEMSELVES, not tell them the answer.",
    "- If the student is stuck, guide the student by ASKING THEM QUESTIONS that help them move forward.",
    "- If the diffs show the student guessing repeatedly, help them discover a method to work it out rather than inviting another guess - either by asking them a question towards the method, or giving them the method if that doesn't actively detract from their learning in this exercise.",
    "- Focus on helping them get to the NEXT STEP in the exercise, and then let them code.",
    "- Your job is NOT TO TEACH new concepts or ideas.",
    "- Speak naturally like a tutor to a student. Don't parrot what a student says.",
    "- Reference the specific parts of their code that they should look at carefully.",
    "- Look carefully at what a student has ALREADY BEEN TAUGHT and only presume that level of knowledge.",
    "- Keep responses concise and focused (1-3 sentences maximum. You can use markdown).",
    "- Be supportive but avoid being sycophant. If someone asks for help, you don't need to praise them for that etc.",
    "- Remember the user might be very capable and smart, or might not be that bright. Try and sense this based on how they're communicating and adjust accordingly. Lack of coding knowledge does not equate to intelligence or ability.",
    "- Respond in the same language as the student is talking to you."
  ];

  if (isDev) {
    rules.push("- If the users message starts with TESTESTEST follow the instruction it gives you.");
  }

  return `## How You Act

${rules.join("\n")}`;
}

/**
 * The final directive, placed at the very end of the user turn (after all the
 * context and the current code), per the guidance to put the specific
 * instruction last. It states the task and points back to the behavioural rules
 * in "How You Act" rather than restating them.
 */
function buildFinalInstructionsSection(): string {
  return `## Your Instructions

Respond to the student's last post above, treating their Current Code as the source of truth for where they are now. Help them find the next step themselves, acting exactly as described in "How You Act" above.`;
}
