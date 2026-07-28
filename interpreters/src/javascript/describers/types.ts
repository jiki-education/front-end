import type { DescriptionContext as SharedDescriptionContext, Description, FrameWithResult } from "../../shared/frames";
import type { Translator } from "../../shared/i18n";

/**
 * JavaScript-specific description context.
 *
 * Extends the shared context with the per-run `t` translator so describers
 * resolve their student-facing prose through the i18n catalog
 * (`description.*`) instead of hardcoding English. The translator is always
 * populated by `frameDescribers.describeFrame` (from the executor's per-run
 * translator, or the bundled default when nothing is injected), so describers
 * can rely on `context.t` being present.
 */
export interface DescriptionContext extends SharedDescriptionContext {
  t: Translator;
}

export type { Description, FrameWithResult };
