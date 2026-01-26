import { expect } from "vitest";
import { DescriptionContext } from "@shared/frames";
import { Location } from "@jikiscript/location";
import { Span } from "@jikiscript/location";
import * as Jiki from "@jikiscript/jikiObjects";

export const assertHTML = (actual: string, result: string, steps: string[]) => {
  const tidy = (text: string) =>
    text
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .flat() // Remove nils
      .join("\n")
      .replaceAll(/>\s+/g, ">")
      .replaceAll(/\s+</g, "<")
      .replace(/ data-hl-from=\"\d+\" data-hl-to=\"\d+\"/g, "");

  const expected = `<div>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
    What happened
  </div>
       ${result}
       <hr/>
       <h3>Steps Jiki Took</h3>
       <ul>
       ${steps.join("\n")}
      </ul>`;

  expect(tidy(actual)).toBe(tidy(expected));
};

export const location = new Location(0, new Span(0, 0), new Span(0, 0));
export const getNameFunction = {
  name: "get_name",
  func: (_interpreter: any) => {
    return new Jiki.String("Jeremy");
  },
  description: "always returns the string Jeremy",
};
export const getNameWithArgsFunction = {
  name: "get_name",
  func: (_: any, _2: any) => {
    return new Jiki.String("Jeremy");
  },
  description: "always returns the string Jeremy",
};

export const getTrueFunction = {
  name: "get_true",
  func: (_interpreter: any) => {
    return Jiki.True;
  },
  description: "",
};
export const getFalseFunction = {
  name: "get_false",
  func: (_interpreter: any) => {
    return Jiki.False;
  },
  description: "",
};

export const mehFunction = {
  name: "meh",
  func: (_: any) => {},
  description: "is a little meh",
};

export const mehWithArgsFunction = {
  name: "meh",
  func: (_: any, _2: any) => {},
  description: "is a little meh",
};

export const contextToDescriptionContext = (context: any): DescriptionContext => {
  // Convert array into object with name as key
  // and description as value
  const funcs = context.externalFunctions.reduce((acc: any, fn: any) => {
    acc[fn.name] = fn.description;
    return acc;
  }, {});

  return {
    functionDescriptions: funcs,
  };
};
