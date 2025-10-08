import type { JSArray, JikiObject } from "../../jsObjects";
import { JSString, JSNull, JSUndefined } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange, guardArgType } from "../guards";

export const join: Method = {
  arity: [0, 1],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate 0 or 1 argument
    guardArgRange(args, 0, 1, "join");

    // Parse optional separator (defaults to ",")
    let separator = ",";
    if (args.length === 1) {
      guardArgType(args[0], "string", "join", "separator");
      separator = (args[0] as JSString).value;
    }

    // Convert all elements to strings and join
    // Note: JavaScript's join() converts null/undefined to empty strings, not "null"/"undefined"
    const stringElements = array.elements.map(elem => {
      // Match native JavaScript behavior: null and undefined become empty strings
      if (elem instanceof JSNull || elem instanceof JSUndefined) {
        return "";
      }
      return elem.toString();
    });
    const result = stringElements.join(separator);

    return new JSString(result);
  },
  description: "joins all elements of an array into a string with an optional separator",
};
