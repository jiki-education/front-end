import { getExercise } from "@jiki/curriculum";
import type { ExerciseDefinition } from "@jiki/curriculum";
import type { ChatMessage } from "./types";

interface PromptOptions {
  exerciseSlug: string;
  code: string;
  question: string;
  history: ChatMessage[];
}

/**
 * Builds a prompt for the LLM using exercise context from the curriculum.
 * Includes the exercise details, student's code, and conversation history.
 *
 * @param options - Prompt building options
 * @returns The formatted prompt string for Gemini
 * @throws Error if exercise is not found
 */
export async function buildPrompt(options: PromptOptions): Promise<string> {
  const { exerciseSlug, code, question, history } = options;

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
