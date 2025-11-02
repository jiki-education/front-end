import { getExercise } from "@jiki/curriculum";
import type { ExerciseDefinition } from "@jiki/curriculum";
import type { ChatMessage } from "./types";

interface PromptOptions {
  exerciseSlug: string;
  code: string;
  question: string;
  history: ChatMessage[];
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
  const { exerciseSlug, code, question, history } = options;

  // Validate input before building prompt
  validateInput(code, question, history);

  // Get exercise context from bundled curriculum
  const exercise = await getExercise(exerciseSlug);

  if (exercise === null) {
    throw new Error(`Exercise not found: ${exerciseSlug}`);
  }

  // Build exercise context
  const exerciseContext = buildExerciseContext(exercise);

  // Build conversation history (last 5 messages only to manage token count)
  const conversationHistory = history
    .slice(-5)
    .map((msg) => `${msg.role === "user" ? "Student" : "Tutor"}: ${msg.content}`)
    .join("\n\n");

  return `You are a helpful coding tutor assisting a student with a programming exercise.

EXERCISE: ${exercise.title}
${exerciseContext}

CURRENT CODE:
\`\`\`javascript
${code}
\`\`\`

${conversationHistory.length > 0 ? `CONVERSATION HISTORY:\n${conversationHistory}\n\n` : ""}STUDENT QUESTION:
${question}

INSTRUCTIONS:
- Provide a helpful, educational response that guides the student
- Don't give away the complete solution
- Focus on teaching concepts and debugging strategies
- Ask guiding questions when appropriate
- Reference the specific parts of their code that need attention
- Keep responses concise and focused (2-3 paragraphs maximum)

Response:`;
}

function buildExerciseContext(exercise: ExerciseDefinition): string {
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

  return parts.join("\n\n");
}
