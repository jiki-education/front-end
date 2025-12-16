import { test, expect, describe } from "vitest";
import {
  Shared,
  isNumber,
  isString,
  isBoolean,
  isList,
  isDictionary,
} from "../../src/index";
import * as jikiscript from "../../src/jikiscript/jikiObjects";
import * as javascript from "../../src/javascript/jsObjects";
import * as python from "../../src/python/jikiObjects";

describe("Shared type namespace", () => {
  describe("type guards", () => {
    describe("isNumber", () => {
      test("returns true for Jikiscript Number", () => {
        const num = new jikiscript.Number(42);
        expect(isNumber(num)).toBe(true);
      });

      test("returns true for JavaScript JSNumber", () => {
        const num = new javascript.JSNumber(42);
        expect(isNumber(num)).toBe(true);
      });

      test("returns true for Python PyNumber", () => {
        const num = new python.PyNumber(42);
        expect(isNumber(num)).toBe(true);
      });

      test("returns false for non-number types", () => {
        expect(isNumber(new jikiscript.JikiString("hello"))).toBe(false);
        expect(isNumber(new jikiscript.Boolean(true))).toBe(false);
        expect(isNumber(null)).toBe(false);
        expect(isNumber(undefined)).toBe(false);
        expect(isNumber({})).toBe(false);
      });
    });

    describe("isString", () => {
      test("returns true for Jikiscript JikiString", () => {
        const str = new jikiscript.JikiString("hello");
        expect(isString(str)).toBe(true);
      });

      test("returns true for JavaScript JSString", () => {
        const str = new javascript.JSString("hello");
        expect(isString(str)).toBe(true);
      });

      test("returns true for Python PyString", () => {
        const str = new python.PyString("hello");
        expect(isString(str)).toBe(true);
      });

      test("returns false for non-string types", () => {
        expect(isString(new jikiscript.Number(42))).toBe(false);
        expect(isString(new jikiscript.Boolean(true))).toBe(false);
        expect(isString(null)).toBe(false);
        expect(isString(undefined)).toBe(false);
        expect(isString({})).toBe(false);
      });
    });

    describe("isBoolean", () => {
      test("returns true for Jikiscript Boolean", () => {
        const bool = new jikiscript.Boolean(true);
        expect(isBoolean(bool)).toBe(true);
      });

      test("returns true for JavaScript JSBoolean", () => {
        const bool = new javascript.JSBoolean(false);
        expect(isBoolean(bool)).toBe(true);
      });

      test("returns true for Python PyBoolean", () => {
        const bool = new python.PyBoolean(true);
        expect(isBoolean(bool)).toBe(true);
      });

      test("returns false for non-boolean types", () => {
        expect(isBoolean(new jikiscript.Number(42))).toBe(false);
        expect(isBoolean(new jikiscript.JikiString("true"))).toBe(false);
        expect(isBoolean(null)).toBe(false);
        expect(isBoolean(undefined)).toBe(false);
        expect(isBoolean(true)).toBe(false); // primitive boolean, not JikiObject
      });
    });

    describe("isList", () => {
      test("returns true for Jikiscript List", () => {
        const list = new jikiscript.List([]);
        expect(isList(list)).toBe(true);
      });

      test("returns true for JavaScript JSArray", () => {
        const arr = new javascript.JSArray([]);
        expect(isList(arr)).toBe(true);
      });

      test("returns true for Python PyList", () => {
        const list = new python.PyList([]);
        expect(isList(list)).toBe(true);
      });

      test("returns false for non-list types", () => {
        expect(isList(new jikiscript.Number(42))).toBe(false);
        expect(isList(new jikiscript.JikiString("hello"))).toBe(false);
        expect(isList(null)).toBe(false);
        expect(isList(undefined)).toBe(false);
        expect(isList([])).toBe(false); // primitive array, not JikiObject
      });
    });

    describe("isDictionary", () => {
      test("returns true for Jikiscript Dictionary", () => {
        const dict = new jikiscript.Dictionary(new Map());
        expect(isDictionary(dict)).toBe(true);
      });

      test("returns true for JavaScript JSDictionary", () => {
        const dict = new javascript.JSDictionary(new Map());
        expect(isDictionary(dict)).toBe(true);
      });

      test("returns false for non-dictionary types", () => {
        expect(isDictionary(new jikiscript.Number(42))).toBe(false);
        expect(isDictionary(new jikiscript.List([]))).toBe(false);
        expect(isDictionary(null)).toBe(false);
        expect(isDictionary(undefined)).toBe(false);
        expect(isDictionary({})).toBe(false); // primitive object, not JikiObject
      });
    });
  });

  describe("type compatibility", () => {
    test("Shared.Number accepts all interpreter Number types", () => {
      const jikiNum: Shared.Number = new jikiscript.Number(1);
      const jsNum: Shared.Number = new javascript.JSNumber(2);
      const pyNum: Shared.Number = new python.PyNumber(3);

      expect(jikiNum.value).toBe(1);
      expect(jsNum.value).toBe(2);
      expect(pyNum.value).toBe(3);
    });

    test("Shared.String accepts all interpreter String types", () => {
      const jikiStr: Shared.String = new jikiscript.JikiString("a");
      const jsStr: Shared.String = new javascript.JSString("b");
      const pyStr: Shared.String = new python.PyString("c");

      expect(jikiStr.value).toBe("a");
      expect(jsStr.value).toBe("b");
      expect(pyStr.value).toBe("c");
    });

    test("Shared.Boolean accepts all interpreter Boolean types", () => {
      const jikiBool: Shared.Boolean = new jikiscript.Boolean(true);
      const jsBool: Shared.Boolean = new javascript.JSBoolean(false);
      const pyBool: Shared.Boolean = new python.PyBoolean(true);

      expect(jikiBool.value).toBe(true);
      expect(jsBool.value).toBe(false);
      expect(pyBool.value).toBe(true);
    });

    test("Shared.List accepts all interpreter List types", () => {
      const jikiList: Shared.List = new jikiscript.List([
        new jikiscript.Number(1),
      ]);
      const jsList: Shared.List = new javascript.JSArray([
        new javascript.JSNumber(2),
      ]);
      const pyList: Shared.List = new python.PyList([new python.PyNumber(3)]);

      expect(jikiList.length).toBe(1);
      expect(jsList.length).toBe(1);
      expect(pyList.length).toBe(1);
    });

    test("Shared.Dictionary accepts Jikiscript and JavaScript Dictionary types", () => {
      const jikiDict: Shared.Dictionary = new jikiscript.Dictionary(new Map());
      const jsDict: Shared.Dictionary = new javascript.JSDictionary(new Map());

      expect(jikiDict.value.size).toBe(0);
      expect(jsDict.value.size).toBe(0);
    });
  });

  describe("type narrowing with type guards", () => {
    test("isNumber narrows type to Shared.Number", () => {
      const obj: Shared.JikiObject = new jikiscript.Number(42);

      if (isNumber(obj)) {
        // TypeScript should know obj.value is a number here
        const value: number = obj.value;
        expect(value).toBe(42);
      } else {
        throw new Error("Type guard failed");
      }
    });

    test("isString narrows type to Shared.String", () => {
      const obj: Shared.JikiObject = new javascript.JSString("hello");

      if (isString(obj)) {
        // TypeScript should know obj.value is a string here
        const value: string = obj.value;
        expect(value).toBe("hello");
      } else {
        throw new Error("Type guard failed");
      }
    });

    test("type guards work in function parameters", () => {
      function acceptsNumber(obj: Shared.JikiObject): number {
        if (!isNumber(obj)) {
          throw new Error("Expected a number");
        }
        return obj.value;
      }

      expect(acceptsNumber(new jikiscript.Number(10))).toBe(10);
      expect(acceptsNumber(new javascript.JSNumber(20))).toBe(20);
      expect(acceptsNumber(new python.PyNumber(30))).toBe(30);
    });
  });
});
