import type { ExternalFunction, ExecutionContext } from "@jiki/interpreters";
import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

const mockApiData: Record<string, Record<string, string>> = {
  Amsterdam: { dayOfWeek: "Monday", time: "00:28" },
  Tokyo: { dayOfWeek: "Monday", time: "08:39" },
  Lima: { dayOfWeek: "Sunday", time: "18:39" }
};

const API_URL = "https://timeapi.io/api/time/current/city";

export default class LookupTimeExercise extends IOExercise {
  protected get slug() {
    return metadata.slug;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private fetch(executionCtx: ExecutionContext, url: any, params: any): Record<string, string> {
    const urlValue = url?.value ?? url;
    if (urlValue !== API_URL) {
      return executionCtx.logicError(this.t("errors.blockedUrl"));
    }

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const cityObj = params.getProperty ? params.getProperty("city") : params.value?.get?.("city");
    const city = cityObj?.value ?? cityObj;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (city && mockApiData[city]) {
      return mockApiData[city];
    }
    return { error: "Could not determine the time." };
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "fetch",
      func: this.fetch.bind(this),
      description: "Fetches data from a URL with the given parameters",
      arity: 2
    }
  ];
}
