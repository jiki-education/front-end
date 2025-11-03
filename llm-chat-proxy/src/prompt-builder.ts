import { getExercise, getLLMMetadata } from "@jiki/curriculum";
import type { ExerciseDefinition, LLMMetadata } from "@jiki/curriculum";
import type { ChatMessage } from "./types";

interface PromptOptions {
  exerciseSlug: string;
  code: string;
  question: string;
  history: ChatMessage[];
  nextTaskId?: string;
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
  const { exerciseSlug, code, question, history, nextTaskId } = options;

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
    buildExerciseSection(exercise),
    buildExerciseContext(exercise, llmMetadata, nextTaskId),
    buildConversationHistorySection(history),
    buildStudentQuestionSection(question),
    buildCurrentCodeSection(code),
    buildInstructionsSection()
  ];

  // Filter out null sections and join with double newlines
  return sections.filter((section) => section !== null).join("\n\n");
}

/**
 * Builds LLM-specific teaching guidance from metadata.
 * Returns early if no metadata available.
 *
 * @param llmMetadata - Exercise LLM metadata (if available)
 * @param nextTaskId - ID of the task the student is currently working on
 * @returns LLM guidance string, or empty string if no metadata
 */
function buildLLMGuidance(llmMetadata: LLMMetadata | undefined, nextTaskId?: string): string {
  if (!llmMetadata) {
    return "";
  }

  const parts: string[] = [];

  // Always include exercise-level teaching context
  parts.push(`TEACHING CONTEXT: ${llmMetadata.description}`);

  // If nextTaskId is provided and exists in metadata, show ONLY that task's guidance
  if (nextTaskId && llmMetadata.tasks[nextTaskId as keyof typeof llmMetadata.tasks]) {
    const taskMeta = llmMetadata.tasks[nextTaskId as keyof typeof llmMetadata.tasks];
    parts.push(`CURRENT TASK GUIDANCE: ${taskMeta.description}`);
  }

  return parts.join("\n\n");
}

function buildExerciseContext(
  exercise: ExerciseDefinition,
  llmMetadata: LLMMetadata | undefined,
  nextTaskId?: string
): string {
  const parts: string[] = [];

  if (exercise.instructions !== undefined) {
    parts.push(`INSTRUCTIONS: ${exercise.instructions}`);
  }

  if (exercise.hints !== undefined && exercise.hints.length > 0) {
    parts.push(`HINTS AVAILABLE:\n${exercise.hints.map((hint) => `- ${hint}`).join("\n")}`);
  }

  if (exercise.tasks !== undefined && exercise.tasks.length > 0) {
    parts.push(`TASKS:\n${exercise.tasks.map((task) => `- ${task.name}`).join("\n")}`);
  }

  // Include LLM-specific guidance
  const llmGuidance = buildLLMGuidance(llmMetadata, nextTaskId);
  if (llmGuidance) {
    parts.push(llmGuidance);
  }

  return parts.join("\n\n");
}

function buildSystemMessage(): string {
  return "You are a helpful coding tutor assisting a student with a programming exercise.";
}

function buildExerciseSection(exercise: ExerciseDefinition): string {
  return `## Exercise: ${exercise.title}`;
}

function buildCurrentCodeSection(code: string): string {
  return `## Current Code

\`\`\`javascript
${code}
\`\`\``;
}

function buildConversationHistorySection(history: ChatMessage[]): string | null {
  if (history.length === 0) {
    return null;
  }

  const conversationHistory = history
    .slice(-5)
    .map((msg) => `${msg.role === "user" ? "Student" : "Tutor"}: ${msg.content}`)
    .join("\n\n");

  return `## Conversation History:\n${conversationHistory}`;
}

function buildStudentQuestionSection(question: string): string {
  return `## Student Last post:
${question}`;
}

function buildInstructionsSection(): string {
  return `## Instructions:
- Provide a helpful, educational response that guides the student
- Don't give away the complete solution
- Focus on teaching concepts and debugging strategies
- Ask guiding questions when appropriate
- Reference the specific parts of their code that need attention
- Keep responses concise and focused (1-3 sentences maximum. You can use markdown)

Response:`;
}
