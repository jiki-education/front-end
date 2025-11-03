import { describe, it, expect } from "vitest";
import { exercises } from "../src/exercises";
import { getLLMMetadata } from "../src/llm-metadata";

describe("LLM Metadata Completeness", () => {
  /**
   * This test ensures that every exercise has LLM metadata defined.
   * LLM metadata is used by llm-chat-proxy to provide context-aware help to students.
   *
   * If this test fails, it means:
   * 1. An exercise is missing its llm-metadata.ts file
   * 2. The metadata is not properly registered in src/llm-metadata.ts
   */

  for (const [slug] of Object.entries(exercises)) {
    it(`${slug}: should have LLM metadata with description`, async () => {
      const metadata = getLLMMetadata(slug);

      expect(metadata).toBeDefined();
      expect(metadata?.description).toBeDefined();
      expect(typeof metadata?.description).toBe("string");
      expect(metadata?.description.length).toBeGreaterThan(0);
    });

    it(`${slug}: should have task-specific LLM metadata for all tasks`, async () => {
      const exerciseModule = await exercises[slug as keyof typeof exercises]();
      const exercise = exerciseModule.default;
      const metadata = getLLMMetadata(slug);

      expect(metadata).toBeDefined();

      // Verify each task has metadata
      for (const task of exercise.tasks) {
        const taskMeta = metadata?.tasks[task.id as keyof typeof metadata.tasks];

        expect(taskMeta).toBeDefined();
        expect(taskMeta?.description).toBeDefined();
        expect(typeof taskMeta?.description).toBe("string");
        expect(taskMeta?.description.length).toBeGreaterThan(0);
      }
    });
  }
});
