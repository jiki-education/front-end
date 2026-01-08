import type * as jikiscript from "../jikiscript/jikiObjects";
import type * as javascript from "../javascript/jsObjects";
import type * as python from "../python/jikiObjects";

export namespace Shared {
  // Primitive types
  export type Number = jikiscript.Number | javascript.JSNumber | python.PyNumber;
  export type String = jikiscript.JikiString | javascript.JSString | python.PyString;
  export type Boolean = jikiscript.Boolean | javascript.JSBoolean | python.PyBoolean;

  // Collection types
  export type List = jikiscript.List | javascript.JSArray | python.PyList;
  export type Dictionary = jikiscript.Dictionary | javascript.JSDictionary; // Python doesn't have this yet

  // Base type
  export type JikiObject = jikiscript.JikiObject | javascript.JikiObject | python.JikiObject;
}
