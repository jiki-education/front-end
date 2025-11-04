// Type declarations for importing solution files as text from curriculum
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
