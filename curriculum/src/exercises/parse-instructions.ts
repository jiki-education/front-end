import matter from "gray-matter";

export interface ParsedInstructions {
  title: string;
  description: string;
  instructions: string;
}

interface InstructionsFrontmatter {
  title?: string;
  description?: string;
}

export function parseInstructions(raw: string): ParsedInstructions {
  const { data, content } = matter<InstructionsFrontmatter>(raw);

  return {
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    instructions: content.trim()
  };
}
