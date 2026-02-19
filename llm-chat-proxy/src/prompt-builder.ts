import { getExercise, getLLMMetadata, getTaughtConcepts } from "@jiki/curriculum";
import type { ExerciseDefinition, LLMMetadata, Language } from "@jiki/curriculum";
import type { ChatMessage } from "./types";

interface PromptOptions {
  exerciseSlug: string;
  code: string;
  question: string;
  history: ChatMessage[];
  nextTaskId?: string;
  language: Language;
}

// Input validation limits to prevent abuse and prompt injection
export const INPUT_LIMITS = {
  CODE_MAX_LENGTH: 50000, // 50KB of code
  QUESTION_MAX_LENGTH: 5000, // 5KB question
  HISTORY_MAX_MESSAGES: 10, // Maximum messages in history
  HISTORY_TOTAL_LENGTH: 50000, // 50KB total history
  MESSAGE_MAX_LENGTH: 10000 // 10KB per message
} as const;

/**
 * Validates and sanitizes user input to prevent prompt injection and abuse.
 * @param code - User's code
 * @param question - User's question
 * @param history - Conversation history
 * @throws Error if input exceeds limits
 */
function validateInput(code: string, question: string, history: ChatMessage[]): void {
  // Validate code length
  if (code.length > INPUT_LIMITS.CODE_MAX_LENGTH) {
    throw new Error(`Code exceeds maximum length of ${INPUT_LIMITS.CODE_MAX_LENGTH} characters`);
  }

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
 * Builds a prompt for the LLM using exercise context from the curriculum.
 * Includes the exercise details, student's code, and conversation history.
 *
 * @param options - Prompt building options
 * @returns The formatted prompt string for Gemini
 * @throws Error if exercise is not found or input validation fails
 */
export async function buildPrompt(options: PromptOptions): Promise<string> {
  const { exerciseSlug, code, question, history, nextTaskId, language } = options;

  // Validate input before building prompt
  validateInput(code, question, history);

  // Get exercise context from bundled curriculum
  const exercise = await getExercise(exerciseSlug);

  if (exercise === null) {
    throw new Error(`Exercise not found: ${exerciseSlug}`);
  }

  // Get LLM metadata for context-aware help
  const llmMetadata = getLLMMetadata(exerciseSlug);

  // Build prompt sections
  const sections = [
    buildSystemMessage(),
    buildExerciseSection(exercise, llmMetadata, nextTaskId),
    buildTaughtConceptsSection(exercise),
    buildConversationHistorySection(history),
    buildStudentQuestionSection(question),
    buildInitialCodeSection(exercise.stubs[language], language),
    buildTargetCodeSection(exercise.solutions[language], language),
    buildCurrentCodeSection(code, language),
    buildInstructionsSection()
  ];

  // Filter out null/empty sections and join with double newlines
  const prompt = sections.filter((section) => section !== null && section !== "").join("\n\n");

  // Log prompt for debugging in development
  console.log("[Prompt Builder] Generated prompt:");
  console.log("=".repeat(80));
  console.log(prompt);
  console.log("=".repeat(80));

  return prompt;
}

function buildSystemMessage(): string {
  return `
  ### Context
  
  You are a helpful coding tutor assisting a student with a programming exercise.
  You are operating within a coding education platform called Jiki. 
  Jiki is made by the team being Exercism. The course is taught by Jeremy Walker. 
  Students are taught with anologies using a character called Jiki who lives in a warehouse, has boxes for variables, and shelves for machines.
  Students are encouraged to think in those terms.

  They are using a variant of JavaScript that has these additional features:
  - \`random(x) { ... }\` - Loops x times.
  - \`random() { ... }\` Loops until the exercise exits.
  - \`Math.randomNumber(format, to)\` - returns a random integer - from and to are inclusive.

  The student is on a page with:
  - Code editor at the top left. 
  - Scenarios (effectively test-cases) at the bottom-left.
  - THe RHS a series of tables including instructions and this window in which they're talking to you.

  **WE** are providing you with their code and the other information. You should operate **as if you can see the UI they're working in and their code**.
  
  Much of this information may be irrelevant, but if it comes up you can use it.

  They have written to you (see conversation below).
  `;
}

function buildExerciseSection(
  exercise: ExerciseDefinition,
  llmMetadata: LLMMetadata | undefined,
  nextTaskId?: string
): string {
  const parts: string[] = [];

  // Exercise title
  parts.push(`## Exercise: ${exercise.title}`);

  // LLM metadata if available
  if (llmMetadata) {
    // Always include exercise-level teaching context
    parts.push(`## Exercise Context\n\n${llmMetadata.description}`);

    // If nextTaskId is provided and exists in metadata, show ONLY that task's guidance
    if (nextTaskId && llmMetadata.tasks[nextTaskId as keyof typeof llmMetadata.tasks]) {
      const taskMeta = llmMetadata.tasks[nextTaskId as keyof typeof llmMetadata.tasks];
      parts.push(`### Current Task Context\n\n${taskMeta.description}`);
    }
  }

  return parts.join("\n\n");
}

function buildTaughtConceptsSection(exercise: ExerciseDefinition): string | null {
  const concepts = getTaughtConcepts(exercise.levelId);
  if (concepts.length === 0) {
    return null;
  }

  const bulletList = concepts.map((c) => `- ${c}`).join("\n");

  return `## What The Student Has Been Taught

The following is everything the student has been taught so far. Do not suggest concepts, approaches, or syntax beyond this.

${bulletList}`;
}

function buildConversationHistorySection(history: ChatMessage[]): string | null {
  if (history.length === 0) {
    return null;
  }

  const conversationHistory = history
    .slice(-5)
    .map((msg) => `${msg.role === "user" ? "Student" : "You"}: ${msg.content}`)
    .join("\n\n");

  return `## Conversation History\n${conversationHistory}`;
}

function buildStudentQuestionSection(question: string): string {
  return `## Student Last post (The message you are replying to)

${question}`;
}

function buildInitialCodeSection(code: string | null, language: Language): string | null {
  if (!code) {
    return null;
  }

  return `## Initial Code

  What we gave the student as their starting point.

\`\`\`javascript
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

\`\`\`${language}
${code}
\`\`\``;
}

function buildCurrentCodeSection(code: string, language: Language): string {
  return `## Current Code

This is the student's current code.

\`\`\`${language}
${code}
\`\`\``;
}

function buildInstructionsSection(): string {
  return `## Instructions

- Your job is to GUIDE the student to DISCOVER the answer THEMSELVES.
- Speak naturally like a tutor to a student. Don't parrot what a student says.
- IMPORTANT: Do NOT give away the answer. 
- Attempt to guide the student by ASKING THEM QUESTIONS that help them move forward.
- Focus on helping them get to the NEXT STEP in the exercise.
- Your job is NOT TO TEACH new concepts or ideas.
- Reference the specific parts of their code that they should look at carefully.
- Look carefully at what a student has ALREADY BEEN TAUGHT and only presume that level of knowledge.
- Keep responses concise and focused (1-3 sentences maximum. You can use markdown)
- Respond in the same language as the student is talking to you.

Response:`;
}
