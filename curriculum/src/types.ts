// Core types used throughout the curriculum package

import type { ExternalFunction } from "@jiki/interpreters";

// Supported programming languages for exercises
export type Language = "javascript" | "python" | "jikiscript";

/**
 * Curriculum authoring shape for an exercise's `availableFunctions` entry.
 *
 * The interpreter's `ExternalFunction.description` is a frame-log "what happened"
 * template (sometimes with `${arg1}`/`${return}` placeholders the interpreter's
 * describer substitutes at call time). To localize those templates, exercises
 * author a `descriptionKey` (a catalog key resolved via `this.t` inside
 * `getExternalFunctions`) instead of an inline English string.
 *
 * `descriptionKey` and `description` are both optional ONLY as a migration state:
 * the end goal is a required `descriptionKey` and no inline `description`. The
 * `description` field is transitional legacy for functions not yet keyed.
 */
export type AvailableFunction = Omit<ExternalFunction, "description"> & {
  descriptionKey?: string; // preferred — resolved via this.t in getExternalFunctions
  description?: string; // TRANSITIONAL legacy inline string; removed once every function is keyed
};
