// Import node types from interpreters - the canonical source
import type { javascript, python } from "@jiki/interpreters";

// Core level interface
export interface Level {
  id: string; // e.g., "fundamentals", "control-flow"
  title: string; // e.g., "Programming Fundamentals"
  description: string; // Student facing: What students learn at this level
  educationalGoal: string; // Internal facing: What's the educational goal.

  languageFeatures: {
    javascript?: JavaScriptFeatures;
    python?: PythonFeatures;
  };
}

// JavaScript-specific features
export interface JavaScriptFeatures {
  // AST node types that are allowed
  allowedNodes?: javascript.NodeType[];

  // Language behavior features (excluding allowedNodes from interpreter's LanguageFeatures)
  languageFeatures?: Omit<javascript.LanguageFeatures, "allowedNodes">;
}

// Python features
export interface PythonFeatures {
  // AST node types that are allowed
  allowedNodes?: python.NodeType[];

  // Language behavior features (excluding allowedNodes from interpreter's LanguageFeatures)
  languageFeatures?: Omit<python.LanguageFeatures, "allowedNodes">;
}

// Type aliases for language feature flags (without allowedNodes)
export type JavaScriptFeatureFlags = Omit<javascript.LanguageFeatures, "allowedNodes">;
export type PythonFeatureFlags = Omit<python.LanguageFeatures, "allowedNodes">;
export type LanguageFeatureFlags = JavaScriptFeatureFlags | PythonFeatureFlags;
