import { describe, it, expect } from "vitest";
import { buildPrompt } from "../src/prompt-builder";

describe("Prompt Builder", () => {
  it("should build prompt with exercise context", async () => {
    const prompt = await buildPrompt({
      exerciseSlug: "basic-movement",
      code: 'console.log("hello");',
      question: "How do I fix this?",
      history: []
    });

    expect(prompt).toContain('console.log("hello")');
    expect(prompt).toContain("How do I fix this?");
    expect(prompt).toContain("EXERCISE:");
    expect(prompt).toContain("CURRENT CODE:");
    expect(prompt).toContain("STUDENT QUESTION:");
  });

  it("should include exercise title", async () => {
    const prompt = await buildPrompt({
      exerciseSlug: "basic-movement",
      code: "test",
      question: "test",
      history: []
    });

    expect(prompt).toContain("Basic Movement");
  });

  it("should include conversation history", async () => {
    const prompt = await buildPrompt({
      exerciseSlug: "basic-movement",
      code: 'console.log("hello");',
      question: "What about this?",
      history: [
        { role: "user", content: "Previous question" },
        { role: "assistant", content: "Previous answer" }
      ]
    });

    expect(prompt).toContain("Previous question");
    expect(prompt).toContain("Previous answer");
    expect(prompt).toContain("CONVERSATION HISTORY");
  });

  it("should limit conversation history to last 5 messages", async () => {
    const history = Array.from({ length: 10 }, (_, i) => ({
      role: "user" as const,
      content: `Message ${i}`
    }));

    const prompt = await buildPrompt({
      exerciseSlug: "basic-movement",
      code: "test",
      question: "test",
      history
    });

    // Should include messages 5-9 (last 5)
    expect(prompt).toContain("Message 5");
    expect(prompt).toContain("Message 9");
    // Should not include messages 0-4
    expect(prompt).not.toContain("Message 0");
    expect(prompt).not.toContain("Message 4");
  });

  it("should throw error for unknown exercise", async () => {
    await expect(
      buildPrompt({
        exerciseSlug: "non-existent-exercise",
        code: "test",
        question: "test",
        history: []
      })
    ).rejects.toThrow("Exercise not found");
  });

  it("should not include conversation history section when empty", async () => {
    const prompt = await buildPrompt({
      exerciseSlug: "basic-movement",
      code: "test",
      question: "test",
      history: []
    });

    expect(prompt).not.toContain("CONVERSATION HISTORY");
  });

  it("should include exercise instructions", async () => {
    const prompt = await buildPrompt({
      exerciseSlug: "basic-movement",
      code: "test",
      question: "test",
      history: []
    });

    expect(prompt).toContain("INSTRUCTIONS:");
  });

  it("should include hints if available", async () => {
    const prompt = await buildPrompt({
      exerciseSlug: "basic-movement",
      code: "test",
      question: "test",
      history: []
    });

    expect(prompt).toContain("HINTS AVAILABLE:");
  });
});
