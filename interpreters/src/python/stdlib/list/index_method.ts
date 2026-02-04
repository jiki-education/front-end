import type { PyList } from "../../jikiObjects";
import { PyNumber, type JikiObject } from "../../jikiObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { StdlibError } from "../index";
import { guardArgRange, guardArgType } from "../guards";

// Named 'index_method' to avoid conflict with index.ts aggregator file
export const index: Method = {
  arity: [1, 3], // value required, start and end optional
  call: (_ctx: ExecutionContext, obj: JikiObject | null, args: JikiObject[]) => {
    const list = obj as PyList;

    // Validate argument count (1-3 arguments)
    guardArgRange(args, 1, 3, "index");

    const searchValue = args[0];
    let start = 0;
    let end = list.length;

    // Handle optional start parameter
    if (args.length >= 2) {
      guardArgType(args[1], "number", "index", "start");
      const startArg = args[1] as PyNumber;
      // Python negative indices count from the end
      const normalizedStart = startArg.value < 0 ? list.length + startArg.value : startArg.value;
      start = Math.max(0, normalizedStart);
    }

    // Handle optional end parameter
    if (args.length >= 3) {
      guardArgType(args[2], "number", "index", "end");
      const endArg = args[2] as PyNumber;
      // Python negative indices count from the end
      const normalizedEnd = endArg.value < 0 ? list.length + endArg.value : endArg.value;
      end = Math.min(list.length, normalizedEnd);
    }

    // Search for the value in the specified range
    for (let i = start; i < end; i++) {
      const element = list.getElement(i);
      if (!element) {
        continue;
      }

      // In Python, index() uses equality comparison (==)
      // For now, we'll do simple value comparison
      if (element.type === searchValue.type && element.value === searchValue.value) {
        return new PyNumber(i);
      }
    }

    // Value not found - raise ValueError
    throw new StdlibError("ValueError", `${searchValue.toString()} is not in list`, {
      value: searchValue.toString(),
    });
  },
  description: "returns the index of the first occurrence of a value in the list",
};
