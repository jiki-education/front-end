// Type declarations for importing solution files as text
declare module "*.jiki" {
  const content: string;
  export default content;
}

declare module "*.javascript" {
  const content: string;
  export default content;
}

declare module "*.py" {
  const content: string;
  export default content;
}

declare module "*.md" {
  const content: string;
  export default content;
}

// Explicit ?raw variants for static imports in tests (vitest resolves these)
declare module "*.jiki?raw" {
  const content: string;
  export default content;
}

declare module "*.javascript?raw" {
  const content: string;
  export default content;
}

declare module "*.py?raw" {
  const content: string;
  export default content;
}
