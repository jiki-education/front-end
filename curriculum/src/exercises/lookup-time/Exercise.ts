import type { ExternalFunction, ExecutionContext } from "@jiki/interpreters";
import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

const mockApiData: Record<string, Record<string, string>> = {
  Amsterdam: { dayOfWeek: "Monday", time: "00:28" },
  Tokyo: { dayOfWeek: "Monday", time: "08:39" },
  Lima: { dayOfWeek: "Sunday", time: "18:39" }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mockFetch(_ctx: ExecutionContext, _url: any, params: any): Record<string, string> {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const cityObj = params.getProperty ? params.getProperty("city") : params.value?.get?.("city");
  const city = cityObj?.value ?? cityObj;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (city && mockApiData[city]) {
    return mockApiData[city];
  }
  return { error: "Could not determine the time." };
}

export default class LookupTimeExercise extends IOExercise {
  static slug = metadata.slug;
  static availableFunctions: ExternalFunction[] = [
    {
      name: "fetch",
      func: mockFetch,
      description: "Fetches data from a URL with the given parameters",
      arity: 2
    }
  ];
}
