/// <reference types="vitest/globals" />

import "vitest";

declare module "vitest" {
  interface Assertion {
    toBeArrayOfSize(size: number): void;
    toBeEmpty(): void;
    toIncludeSameMembers(members: any[]): void;
    toBeNil(): void;
    toBeNotNil(): void;
  }
  interface AsymmetricMatchersContaining {
    toBeArrayOfSize(size: number): void;
    toBeEmpty(): void;
    toIncludeSameMembers(members: any[]): void;
    toBeNil(): void;
    toBeNotNil(): void;
  }
}

export {};
