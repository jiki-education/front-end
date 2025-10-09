import type { JSArray, JikiObject, JSNumber } from "../../jsObjects";
import { JSArray as JSArrayClass } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardArgRange, guardArgType } from "../guards";

export const splice: Method = {
  arity: [1, Infinity],
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate at least 1 argument (start index required)
    guardArgRange(args, 1, Infinity, "splice");

    // Parse required start index
    guardArgType(args[0], "number", "splice", "start");
    const start = Math.trunc((args[0] as JSNumber).value);

    // Parse optional deleteCount (defaults to array.length - start if not provided)
    let deleteCount = array.elements.length - start;
    if (args.length >= 2) {
      guardArgType(args[1], "number", "splice", "deleteCount");
      deleteCount = Math.max(0, Math.trunc((args[1] as JSNumber).value));
    }

    // Get items to insert (args from index 2 onward)
    const itemsToInsert = args.slice(2);

    // Use native JavaScript splice() to mutate the array
    // This handles negative indices, out of bounds, etc. automatically
    const deletedElements = array.elements.splice(start, deleteCount, ...itemsToInsert);

    // Return new JSArray with deleted elements
    return new JSArrayClass(deletedElements);
  },
  description: "removes and/or adds elements at a specified position and returns the removed elements",
};
