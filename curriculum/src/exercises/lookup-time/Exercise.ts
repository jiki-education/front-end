import type { ExternalFunction, ExecutionContext } from "@jiki/interpreters";
import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

const mockApiData: Record<string, Record<string, string>> = {
  Amsterdam: { dayOfWeek: "Monday", time: "00:28" },
  Tokyo: { dayOfWeek: "Monday", time: "08:39" },
  Lima: { dayOfWeek: "Sunday", time: "18:39" }
};

function mockFetch(_ctx: ExecutionContext, _url: any, params: any): Record<string, string> {
  console.log("mockFetch called", typeof params, params?.constructor?.name);
  console.log("params keys:", params ? Object.getOwnPropertyNames(Object.getPrototypeOf(params)) : "no params");

  const cityObj = params.getProperty ? params.getProperty("city") : params.value?.get?.("city");
  console.log("cityObj:", cityObj, typeof cityObj);

  const city = cityObj?.value ?? cityObj;
  console.log("city:", city);

  if (city && mockApiData[city]) {
    console.log("returning data:", mockApiData[city]);
    return mockApiData[city];
  }
  console.log("returning error");
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
