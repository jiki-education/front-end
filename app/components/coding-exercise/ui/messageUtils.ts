import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import setupJavascript from "@jiki/highlightjs-javascript";

hljs.registerLanguage("javascript", setupJavascript);

// Configure marked for safe rendering
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true // Convert \n to <br>
});

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'"
};

function unescapeHtml(html: string): string {
  return html.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => HTML_ENTITIES[entity]);
}

export function processMessageContent(content: string): string {
  const html = marked.parse(content, { async: false });

  // Syntax-highlight code blocks inline, so the highlighted markup is present in
  // the string itself (TypeIt then reveals it token by token while typing).
  // Unspecified blocks default to JavaScript; an explicit non-JS language is left untouched.
  return html.replace(
    /<pre><code(?: class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g,
    (match, language: string | undefined, code: string) => {
      if (language && language !== "javascript" && language !== "js") {
        return match;
      }
      const highlighted = hljs.highlight(unescapeHtml(code), { language: "javascript" }).value;
      return `<pre><code class="hljs language-javascript">${highlighted}</code></pre>`;
    }
  );
}
