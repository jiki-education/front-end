/**
 * Copy `text` to the clipboard, falling back to a hidden textarea when the
 * async Clipboard API isn't available.
 *
 * `navigator.clipboard` is only exposed in a secure context. localhost counts
 * as one; a custom hostname over plain HTTP does not, so in development on
 * `local.jiki.io` the whole object is undefined rather than merely failing.
 * That makes this a missing-object guard, not just a rejected promise.
 *
 * Rejects if the copy didn't happen, so callers only show a confirmation when
 * there is something to confirm.
 */
export async function copyToClipboard(text: string): Promise<void> {
  // The DOM types declare `navigator.clipboard` as always present, so the guard
  // reads as redundant; at runtime it is the whole point (see above).
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error: unknown) {
      console.error("Clipboard write failed, falling back:", error);
    }
  }

  copyViaTextarea(text);
}

/**
 * The pre-Clipboard-API approach: select the text in an offscreen field and let
 * the browser's own copy command take it. Deprecated, and the only thing that
 * works in an insecure context.
 */
function copyViaTextarea(text: string): void {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (!document.execCommand("copy")) {
      throw new Error("document.execCommand('copy') reported failure");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}
