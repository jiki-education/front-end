// Mirrors `next/image-types/global` so static image imports type-check in CI.
// next-env.d.ts (which references that module) is gitignored, so CI runs of
// tsc don't have it unless we provide our own declarations.

declare module "*.webp" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.png" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.jpg" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.jpeg" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.gif" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}

declare module "*.avif" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}
