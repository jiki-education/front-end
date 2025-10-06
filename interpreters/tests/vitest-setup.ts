import { expect } from "vitest";

expect.extend({
  toBeNil(received: any) {
    const pass = received === null || received === undefined;
    if (pass) {
      return {
        pass: true,
        message: () => `expected ${received} not to be nil`,
      };
    } else {
      return {
        pass: false,
        message: () => `expected ${received} to be nil`,
      };
    }
  },

  toBeNotNil(received: any) {
    const pass = received !== null && received !== undefined;
    if (pass) {
      return {
        pass: true,
        message: () => `expected ${received} to be nil`,
      };
    } else {
      return {
        pass: false,
        message: () => `expected ${received} not to be nil`,
      };
    }
  },
  toBeArrayOfSize(received: any, size: number) {
    const pass = Array.isArray(received) && received.length === size;
    if (pass) {
      return {
        pass: true,
        message: () => `expected ${received} not to be an array of size ${size}`,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `expected ${received} to be an array of size ${size}, but got ${Array.isArray(received) ? `array of size ${received.length}` : typeof received}`,
      };
    }
  },

  toBeEmpty(received: any) {
    const pass =
      (Array.isArray(received) && received.length === 0) ||
      (typeof received === "string" && received.length === 0) ||
      (received instanceof Set && received.size === 0) ||
      (received instanceof Map && received.size === 0) ||
      (typeof received === "object" && received !== null && Object.keys(received).length === 0);

    if (pass) {
      return {
        pass: true,
        message: () => `expected ${received} not to be empty`,
      };
    } else {
      return {
        pass: false,
        message: () => `expected ${received} to be empty`,
      };
    }
  },

  toIncludeSameMembers(received: any[], expected: any[]) {
    if (!Array.isArray(received)) {
      return {
        pass: false,
        message: () => `expected ${received} to be an array`,
      };
    }

    const receivedSorted = [...received].sort();
    const expectedSorted = [...expected].sort();

    const pass =
      receivedSorted.length === expectedSorted.length &&
      receivedSorted.every((item, index) => {
        return JSON.stringify(item) === JSON.stringify(expectedSorted[index]);
      });

    if (pass) {
      return {
        pass: true,
        message: () => `expected ${received} not to include same members as ${expected}`,
      };
    } else {
      return {
        pass: false,
        message: () => `expected ${received} to include same members as ${expected}`,
      };
    }
  },
});
