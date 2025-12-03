declare module "gray-matter" {
  interface GrayMatterFile<T> {
    data: T;
    content: string;
    excerpt?: string;
    orig: Buffer | string;
    language: string;
    matter: string;
    stringify: (lang: string) => string;
  }

  interface GrayMatterOption<T> {
    excerpt?: boolean | ((file: GrayMatterFile<T>, options: GrayMatterOption<T>) => string);
    excerpt_separator?: string;
    engines?: {
      [index: string]: (input: string) => object;
    };
    language?: string;
    delimiters?: string | [string, string];
  }

  function matter<T = any>(input: string | Buffer, options?: GrayMatterOption<T>): GrayMatterFile<T>;

  export = matter;
}
