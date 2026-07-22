// Mock for marked library to handle ESM imports in Jest

const markedFn = jest.fn((content) => {
  // Simple mock that converts basic markdown to HTML
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **bold**
    .replace(/`(.*?)`/g, "<code>$1</code>") // `code`
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>') // [text](url)
    .replace(/^- (.+)$/gm, "<li>$1</li>") // - list items
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>"); // wrap lists in ul
});

markedFn.parse = markedFn;
markedFn.setOptions = jest.fn();

// Inline-only variant: handles inline markdown but no block-level (lists, paragraphs).
markedFn.parseInline = jest.fn((content) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **bold**
    .replace(/`(.*?)`/g, "<code>$1</code>") // `code`
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'); // [text](url)
});

module.exports = { marked: markedFn };
