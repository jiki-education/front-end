// Type declarations for importing solution files as raw text
declare module "*.jiki?raw" {
  const content: string;
  export default content;
}

declare module "*.js?raw" {
  const content: string;
  export default content;
}

declare module "*.py?raw" {
  const content: string;
  export default content;
}
