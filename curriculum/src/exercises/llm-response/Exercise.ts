import type { ExternalFunction, ExecutionContext } from "@jiki/interpreters";
import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockResponses: Record<string, any> = {
  "Who won the 1966 Football Men's World Cup?": {
    response: {
      question: "Who won the 1966 Football Men's World Cup?",
      answers: [{ text: "England", certainty: "1" }]
    },
    meta: { time: "500ms" }
  },
  "What's the best cacao percentage in chocolate?": {
    response: {
      question: "What's the best cacao percentage in chocolate?",
      answers: [
        { text: "Everyone loves a sugar free 100% experience", certainty: "0.64" },
        { text: "The deep sensations of 82% are the best", certainty: "0.78" },
        { text: "The sweet spot is 70%", certainty: "0.77" },
        { text: "If you have a sweet tooth, 60% is for you", certainty: "0.52" }
      ]
    },
    meta: { time: "123ms" }
  },
  "What's the best website to learn to code?": {
    response: {
      question: "What's the best website to learn to code?",
      answers: [
        { text: "Codecademy is the best", certainty: "0.04" },
        { text: "FreeCodeCamp is the best", certainty: "0.78" },
        { text: "Khan Academy is the best", certainty: "0.77" },
        { text: "Exercism is the best", certainty: "0.99" },
        { text: "Coursera is the best", certainty: "0.52" }
      ]
    },
    meta: { time: "1264ms" }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mockFetch(_ctx: ExecutionContext, _url: any, params: any): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const questionObj = params.getProperty ? params.getProperty("question") : params.value?.get?.("question");
  const question = questionObj?.value ?? questionObj;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (question && mockResponses[question]) {
    return mockResponses[question];
  }
  return { error: "Could not determine answer" };
}

export default class LlmResponseExercise extends IOExercise {
  static slug = metadata.slug;
  static availableFunctions: ExternalFunction[] = [
    {
      name: "fetch",
      func: mockFetch,
      description: "fetched data from the provided URL",
      arity: 2
    }
  ];
}
