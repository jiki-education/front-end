"use client";

/**
 * Localized copy for API error responses.
 *
 * The API returns a stable `type` string and structured data, never
 * human-readable text, so every message a user reads for a failed request is
 * resolved here against the `apiErrors` namespace in `messages.json`.
 *
 * A handful of `type` strings mean different things in different flows
 * (`invalid_token` and `token_expired` are OAuth in one place and account
 * deletion in another, `stripe_error` is "we couldn't take your payment" in
 * subscriptions and "we couldn't cancel your subscription" in deletion,
 * `unauthorized` is subscriptions-specific). Callers in those flows pass a
 * `context`, which is tried first and falls back to the unscoped key, so a type
 * only needs a scoped entry where it actually differs.
 *
 * Two entry points, mirroring `lib/toast.tsx`:
 *   - `useApiErrorMessage()` for components, which have a hook in scope
 *   - `<ApiErrorMessage>` / `toastApiError()` for Zustand stores and plain
 *     classes, which resolve their text when React renders them
 */

import { useTranslations } from "next-intl";
import toast, { type ToastOptions } from "react-hot-toast";
import { ApiError, getApiErrorType } from "./client";

// Flows whose copy differs from the unscoped meaning of the same `type`.
export type ApiErrorContext = "subscriptions" | "accountDeletion";

type Translator = ReturnType<typeof useTranslations<"apiErrors">>;
type ErrorValues = Record<string, string | number>;

/**
 * Resolve an error thrown by the API client to localized copy. Anything that
 * isn't an `ApiError` carrying a known `type` resolves to `apiErrors.unknown`,
 * so a caller never has to supply its own fallback string.
 */
export function useApiErrorMessage(context?: ApiErrorContext): (error: unknown) => string {
  const t = useTranslations("apiErrors");
  return (error: unknown) => {
    return resolveApiError(t, error, context);
  };
}

export function ApiErrorMessage({ error, context }: { error: unknown; context?: ApiErrorContext }) {
  const t = useTranslations("apiErrors");
  return <>{resolveApiError(t, error, context)}</>;
}

export function toastApiError(error: unknown, context?: ApiErrorContext, options?: ToastOptions) {
  return toast.error(<ApiErrorMessage error={error} context={context} />, options);
}

function resolveApiError(t: Translator, error: unknown, context?: ApiErrorContext): string {
  const type = getApiErrorType(error);
  if (!type) {
    return t("unknown");
  }

  if (type === "validation_error") {
    const detailed = resolveValidationDetails(t, error);
    if (detailed) {
      return detailed;
    }
  }

  const values = extractValues(error);

  // Most specific first: a flow that redefines the type, then a type whose
  // meaning is split by a `reason` discriminator, then the type itself.
  const candidates: string[] = [];
  if (context) {
    candidates.push(`${context}.${type}`);
  }
  if (typeof values.reason === "string") {
    candidates.push(`reasons.${type}.${values.reason}`);
  }
  candidates.push(type);

  for (const candidate of candidates) {
    if (isLeaf(t, candidate)) {
      return t(candidate as Parameters<Translator>[0], values);
    }
  }
  return t("unknown");
}

/**
 * Turn a `validation_error`'s `details` into a sentence per failing field.
 *
 * `details` is ActiveRecord's `errors.details`, which is symbolic rather than
 * prose: `{ email: [{ error: "invalid" }], password: [{ error: "too_short",
 * count: 8 }] }`. The symbol names the message (`validation.<code>`), the field
 * names its subject (`fields.<field>`), and anything else in the entry is an
 * ICU value, which is where `count` in "at least 8 characters" comes from.
 *
 * Returns null when nothing could be resolved (an unknown field, an unknown
 * code, or an API that has not sent `details` yet), so the caller falls back to
 * the generic `validation_error` line. A half-rendered list would be worse than
 * one honest sentence, so a field we cannot name is dropped rather than shown
 * with its raw wire key.
 */
function resolveValidationDetails(t: Translator, error: unknown): string | null {
  const details = (extractErrorField(error) as { details?: unknown } | null)?.details;
  if (typeof details !== "object" || details === null) {
    return null;
  }

  const sentences: string[] = [];
  for (const [field, entries] of Object.entries(details)) {
    if (!Array.isArray(entries) || !isLeaf(t, `fields.${field}`)) {
      continue;
    }
    for (const entry of entries) {
      if (typeof entry !== "object" || entry === null) {
        continue;
      }
      const { error: code, ...rest } = entry as { error?: unknown };
      if (typeof code !== "string" || !isLeaf(t, `validation.${code}`)) {
        continue;
      }
      const values: ErrorValues = { field: t(`fields.${field}` as Parameters<Translator>[0]) };
      for (const [key, value] of Object.entries(rest)) {
        if (typeof value === "string" || typeof value === "number") {
          values[camelize(key)] = value;
        }
      }
      sentences.push(t(`validation.${code}` as Parameters<Translator>[0], values));
    }
  }

  return sentences.length > 0 ? sentences.join(" ") : null;
}

/**
 * True when the key resolves to a string rather than a missing key or a group
 * of keys. `t.has` alone is not enough: `apiErrors.reasons` exists but is an
 * object, and translating it would render the key instead of a sentence.
 *
 * Both checks take the same key type as `t`, and every key here is built at
 * runtime from a wire string, so none can be typed as a known key.
 */
function isLeaf(t: Translator, key: string): boolean {
  return (
    t.has(key as Parameters<Translator["has"]>[0]) && typeof t.raw(key as Parameters<Translator["raw"]>[0]) === "string"
  );
}

/**
 * Flatten the structured extras beside `type` into ICU values. Wire keys are
 * snake_case and the catalogue's placeholders are camelCase, so `max_bytes`
 * interpolates as `{maxBytes}`. Arrays are joined, since every array the API
 * sends today (`filenames`) reads as a list in a sentence.
 */
function extractValues(error: unknown): ErrorValues {
  const errorField = extractErrorField(error);
  if (!errorField) {
    return {};
  }

  const values: ErrorValues = {};
  for (const [key, value] of Object.entries(errorField)) {
    if (key === "type") {
      continue;
    }
    if (typeof value === "string" || typeof value === "number") {
      values[camelize(key)] = value;
    } else if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
      values[camelize(key)] = value.join(", ");
    }
  }
  return values;
}

// The `error` object inside an ApiError's body, or null for anything else.
function extractErrorField(error: unknown): Record<string, unknown> | null {
  if (!(error instanceof ApiError) || typeof error.data !== "object" || error.data === null) {
    return null;
  }
  const errorField = (error.data as { error?: unknown }).error;
  if (typeof errorField !== "object" || errorField === null) {
    return null;
  }
  return errorField as Record<string, unknown>;
}

function camelize(key: string): string {
  return key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}
