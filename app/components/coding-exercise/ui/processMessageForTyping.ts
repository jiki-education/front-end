import { marked } from "marked";

// Configure marked for safe rendering
marked.setOptions({
  gfm: true,
  breaks: true
});

/**
 * Process message content for TypeIt animation.
 * Keeps cursor inline with text by avoiding block-level wrapper on the last element.
 */
export function processMessageForTyping(content: string): string {
  // First parse with marked
  let html = marked.parse(content, { async: false });

  // Process code blocks to match your structure
  html = html.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, '<div class="codeBlock">$1</div>');

  // Ensure inline code has proper styling
  html = html.replace(/<code>([^<]+)<\/code>/g, "<code>$1</code>");

  // IMPORTANT: Remove the trailing newline/paragraph wrapper if it exists
  // This keeps the cursor inline with the last typed character
  html = html.trim();

  // If the entire content is wrapped in a single <p> tag, unwrap it for inline typing
  // This prevents the cursor from appearing on a new line
  const singleParagraphMatch = html.match(/^<p>([\s\S]*)<\/p>$/);
  if (singleParagraphMatch && !singleParagraphMatch[1].includes("<p>")) {
    html = singleParagraphMatch[1];
  }

  return html;
}
