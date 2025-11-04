# Chat Typing Animation System

This document describes the TypeIt-based typing animation system used in the chat component to create a realistic typing effect for AI responses.

## Overview

The system uses three simple states to create a smooth typing animation flow:

1. **"thinking"** - API call in progress
2. **"typing"** - TypeIt animation playing
3. **"idle"** - Animation complete, ready for next message

## Key Components

### State Management (useChatState.ts)

- `StreamStatus` type: `"idle" | "thinking" | "typing" | "error"`
- `finishTyping()` function: Handles completion of typing animation

### Chat Flow (useChat.ts)

- `onTextChunk`: Updates content but keeps status as "thinking"
- `onComplete`: Sets status to "typing" to trigger animation (does NOT add to history)

### UI Component (TypeItAssistantMessage.tsx)

- Shows TypeIt component only when `status === "typing"`
- Uses `afterComplete` callback to trigger completion

## Critical Implementation Details

### Order of Operations

The order of operations in the `onComplete` callback is crucial:

```typescript
onComplete: (fullResponse, signature) => {
  // 1. Set the response content first
  chatState.setCurrentResponse(fullResponse);

  // 2. Handle signature/saving
  if (signature) {
    chatState.setSignature(signature);
    void saveConversation(context.exerciseSlug, message, fullResponse, signature);
  }

  // 3. Start typing animation
  chatState.setStatus("typing");

  // 4. DO NOT add to history here - wait for typing to complete
};
```

### Typing Completion Flow

When TypeIt finishes, the `finishTyping` function:

```typescript
const finishTyping = useCallback(() => {
  setState((prev) => ({
    ...prev,
    messages: [
      ...prev.messages,
      { role: "assistant", content: prev.currentResponse } // Add to history
    ],
    currentResponse: "", // Clear current response
    status: "idle" // Return to idle state
  }));
}, []);
```

### TypeIt Configuration

Simple configuration that works reliably:

```typescript
<TypeIt
  options={{
    speed: typingSpeed,
    afterComplete: () => {
      onTypingComplete?.();
    }
  }}
>
  {content}
</TypeIt>
```

## Common Pitfalls to Avoid

### 1. Adding to History Too Early

❌ **Wrong**: Calling `addMessageToHistory` in `onComplete` clears `currentResponse` before typing starts

✅ **Correct**: Add to history only in `finishTyping` after animation completes

### 2. Complex State Management

❌ **Wrong**: Using intermediate states like "streaming" that cause re-renders during content updates

✅ **Correct**: Keep content updates separate from animation triggers

### 3. TypeIt Re-rendering

❌ **Wrong**: Updating content while TypeIt is active causes it to restart

✅ **Correct**: Only start TypeIt when content is final and status is "typing"

## Flow Diagram

```
User sends message
↓
Status: "thinking" (API call starts)
↓
Content updates arrive (status stays "thinking")
↓
API complete → setCurrentResponse() + setStatus("typing")
↓
TypeIt animation starts
↓
TypeIt completes → afterComplete callback
↓
finishTyping() → add to history + clear response + status: "idle"
```

## Testing

Use the `/dev/typing-test` page to test the typing mechanism without API calls. The test panel includes:

- Speed control slider
- Manual triggering of different states
- Debug information display

## Dependencies

- **typeit-react**: React wrapper for TypeIt.js
- **TypeIt.js**: The underlying typing animation library

The system is designed to work with any TypeIt speed configuration and handles content of any length reliably.
