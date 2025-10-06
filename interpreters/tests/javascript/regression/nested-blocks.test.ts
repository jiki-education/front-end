import { describe, test, expect } from "vitest";
import type { TestAugmentedFrame } from "@shared/frames";
import { interpret } from "@javascript/interpreter";

describe("JavaScript nested blocks regression tests", () => {
  describe("complex nesting patterns", () => {
    test("if inside else block", () => {
      const code = `
        let result = "";
        if (false) {
          result = "wrong";
        } else {
          result = "else1";
          if (true) {
            result = "else-if";
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe("else-if");
    });

    test("for loop inside else block", () => {
      const code = `
        let count = 0;
        if (false) {
          count = 100;
        } else {
          for (let i = 0; i < 3; i++) {
            count = count + 1;
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.count.value).toBe(3);
    });

    test("while loop inside else block", () => {
      const code = `
        let count = 0;
        if (false) {
          count = 100;
        } else {
          let i = 0;
          while (i < 3) {
            count = count + 1;
            i = i + 1;
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.count.value).toBe(3);
    });

    test("deeply nested if-else-if-else chains", () => {
      const code = `
        let result = "";
        if (true) {
          result = "a";
          if (false) {
            result = "b";
          } else {
            result = "c";
            if (true) {
              result = "d";
              if (false) {
                result = "e";
              } else {
                result = "f";
              }
            } else {
              result = "g";
            }
          }
        } else {
          result = "h";
          if (true) {
            result = "i";
          } else {
            result = "j";
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe("f");
    });

    test("nested blocks with mixed control structures", () => {
      const code = `
        let result = 0;
        let x = 5;
        
        if (x > 0) {
          result = 1;
          for (let i = 0; i < 2; i++) {
            result = result + 1;
            if (i === 0) {
              result = result + 10;
            } else {
              let j = 0;
              while (j < 2) {
                result = result + 100;
                j = j + 1;
              }
            }
          }
        } else {
          while (x < 10) {
            if (x === 7) {
              for (let k = 0; k < 3; k++) {
                result = result + k;
              }
            } else {
              result = result + 1;
            }
            x = x + 1;
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      // result starts at 1, +1 (i=0), +10 (if), +1 (i=1), +200 (while j<2) = 213
      expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe(213);
    });

    test("nested for loops inside if-else branches", () => {
      const code = `
        let sum = 0;
        let flag = true;
        
        if (flag) {
          for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
              sum = sum + 1;
            }
          }
        } else {
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
              sum = sum + 2;
            }
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.sum.value).toBe(6); // 2*3 = 6
    });

    test("standalone blocks with nested structures", () => {
      const code = `
        let x = 0;
        {
          let y = 1;
          x = x + y;
          {
            let z = 2;
            x = x + z;
            if (x > 2) {
              for (let i = 0; i < 2; i++) {
                x = x + 1;
              }
            }
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(5); // 0+1+2+1+1
    });

    test("while inside for inside if inside else", () => {
      const code = `
        let result = 0;
        if (false) {
          result = -1;
        } else {
          if (true) {
            for (let i = 0; i < 2; i++) {
              let j = 0;
              while (j < 3) {
                result = result + 1;
                j = j + 1;
              }
            }
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe(6); // 2*3
    });

    test("complex else-if chains with nested blocks", () => {
      const code = `
        let x = 5;
        let result = "";
        
        if (x < 0) {
          result = "negative";
        } else if (x === 0) {
          result = "zero";
        } else if (x < 10) {
          result = "small";
          if (x === 5) {
            result = "five";
            {
              let temp = "nested";
              result = result + "-" + temp;
            }
          } else {
            for (let i = 0; i < x; i++) {
              result = result + "x";
            }
          }
        } else {
          result = "large";
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe("five-nested");
    });

    test("for loop with block body containing if-else", () => {
      const code = `
        let sum = 0;
        for (let i = 0; i < 4; i++) {
          {
            if (i === 0 || i === 2) {
              sum = sum + i;
            } else {
              sum = sum + (i * 2);
            }
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.sum.value).toBe(10); // 0 + 2 + 2 + 6
    });
  });
});
