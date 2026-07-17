// Drives one agent turn: user message in, model calls + client-side tool
// execution in a loop, final prose out. The proxy-less BYOK version of the
// planned production loop - history lives here, the model is stateless.

import { devSettingsStore } from "./debug/devSettingsStore";
import type { Orchestrator } from "./Orchestrator";
import { OpenRouterError, streamChatCompletion } from "./openrouter";
import { buildSystemPrompt } from "./systemPrompt";
import { executeTool, TOOL_SCHEMAS } from "./tools";
import type { ChatCompletionMessage } from "./types";

export const MAX_MODEL_CALLS_PER_TURN = 12;

export async function runAgentTurn(orchestrator: Orchestrator, userText: string): Promise<void> {
  orchestrator.setAgentStatus("running");
  orchestrator.appendTranscript({ kind: "user", content: userText });
  orchestrator.history.push({ role: "user", content: userText });

  try {
    await runLoop(orchestrator);
  } catch (error) {
    orchestrator.appendTranscript({ kind: "notice", content: noticeForError(error) });
  } finally {
    orchestrator.setAgentStatus("idle");
  }
}

async function runLoop(orchestrator: Orchestrator): Promise<void> {
  const { openrouterKey, model } = devSettingsStore.getState();

  for (let call = 0; call < MAX_MODEL_CALLS_PER_TURN; call++) {
    const messages: ChatCompletionMessage[] = [
      { role: "system", content: buildSystemPrompt(orchestrator.lesson, orchestrator.getFiles()) },
      ...orchestrator.history
    ];

    let assistantItemId: string | null = null;
    const { text, toolCalls, finishReason } = await streamChatCompletion({
      apiKey: openrouterKey,
      model,
      messages,
      tools: TOOL_SCHEMAS,
      onTextDelta: (delta) => {
        if (assistantItemId === null) {
          assistantItemId = orchestrator.appendTranscript({ kind: "assistant", content: delta });
        } else {
          appendToAssistantItem(orchestrator, assistantItemId, delta);
        }
      }
    });

    orchestrator.history.push({
      role: "assistant",
      content: text || null,
      ...(toolCalls.length > 0 ? { tool_calls: toolCalls } : {})
    });

    if (toolCalls.length === 0) {
      return;
    }

    for (const toolCall of toolCalls) {
      const itemId = orchestrator.appendTranscript({
        kind: "tool",
        name: toolCall.function.name,
        label: labelFor(toolCall.function.name),
        detail: "",
        status: "running"
      });
      const execution = await executeTool(orchestrator, toolCall.function.name, toolCall.function.arguments);
      orchestrator.updateTranscript(itemId, {
        label: execution.label,
        detail: execution.detail,
        status: execution.isError ? "error" : "done"
      });
      orchestrator.history.push({ role: "tool", tool_call_id: toolCall.id, content: execution.result });
    }

    if (finishReason !== "tool_calls" && finishReason !== null && finishReason !== "stop") {
      orchestrator.appendTranscript({ kind: "notice", content: `The model stopped unexpectedly (${finishReason}).` });
      return;
    }
  }

  orchestrator.appendTranscript({
    kind: "notice",
    content: `Stopped after ${MAX_MODEL_CALLS_PER_TURN} steps - send a message to continue.`
  });
}

function appendToAssistantItem(orchestrator: Orchestrator, itemId: string, delta: string): void {
  const transcript = orchestrator.getStore().getState().transcript;
  const item = transcript.find((entry) => entry.id === itemId);
  if (item && item.kind === "assistant") {
    orchestrator.updateTranscript(itemId, { content: item.content + delta });
  }
}

function labelFor(toolName: string): string {
  const labels: Record<string, string> = {
    list_files: "Listing files",
    glob: "Finding files",
    read_file: "Reading",
    write_file: "Writing",
    edit_file: "Editing",
    delete_file: "Deleting",
    grep: "Searching",
    run_code: "Running the code"
  };
  return labels[toolName] ?? toolName;
}

function noticeForError(error: unknown): string {
  if (error instanceof OpenRouterError) {
    if (error.status === 401) {
      return "Your OpenRouter key was rejected - check it in the debug drawer.";
    }
    if (error.status === 402) {
      return "OpenRouter says this model needs credits - pick a :free model or top up.";
    }
    if (error.status === 429) {
      return "Rate limited by OpenRouter - wait a moment and try again.";
    }
    return `The model request failed: ${error.message}`;
  }
  return `Something went wrong: ${error instanceof Error ? error.message : String(error)}`;
}
