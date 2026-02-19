import type { Method } from "../index";
import type { JikiObject } from "../../jsObjects";
import { JSArray, JSString } from "../../jsObjects";
import type { JSDictionary } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import { guardArgType } from "../guards";

export const keys: Method = {
  arity: 1,
  call: (_ctx: ExecutionContext, _thisObj: JikiObject, args: JikiObject[]) => {
    guardArgType(args[0], "object", "Object.keys", "obj");

    const dict = args[0] as JSDictionary;
    const keyStrings = Array.from(dict.value.keys());
    const jsKeys = keyStrings.map(k => new JSString(k));
    return new JSArray(jsKeys);
  },
  description: "returns an array of a given object's own enumerable string-keyed property names",
};
