import { marked } from "marked";

// Configure marked for safe rendering
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true // Convert \n to <br>
});

export function processMessageContent(content: string): string {
  // First parse with marked for basic markdown
  let html = marked.parse(content);
  
  // Process code blocks to match your structure
  // Note: Using regular class name since this is processed HTML string
  html = html.replace(
    /<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g,
    '<div class="codeBlock">$1</div>'
  );
  
  // Ensure inline code has proper styling
  html = html.replace(
    /<code>([^<]+)<\/code>/g,
    '<code>$1</code>'
  );
  
  return html;
}