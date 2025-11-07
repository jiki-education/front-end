// Mock for marked library to handle ESM imports in Jest

const marked = {
  parse: jest.fn((content) => {
    // Simple mock that converts basic markdown to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **bold**
      .replace(/`(.*?)`/g, "<code>$1</code>") // `code`
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>') // [text](url)
      .replace(/^- (.+)$/gm, "<li>$1</li>") // - list items
      .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>"); // wrap lists in ul
  }),
  setOptions: jest.fn()
};

module.exports = { marked };
