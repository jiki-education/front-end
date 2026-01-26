import { expect } from "vitest";

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
       <h3>Steps Python Took</h3>
       <ul>
       ${steps.join("\n")}
      </ul>`;

  expect(tidy(actual)).toBe(tidy(expected));
};

export const assertDescriptionContains = (actual: string, ...expectedPhrases: string[]) => {
  for (const phrase of expectedPhrases) {
    expect(actual).toContain(phrase);
  }
};

export const assertDescriptionExists = (actual: string | undefined) => {
  expect(actual).toBeDefined();
  expect(actual).toBeTruthy();
  expect(typeof actual).toBe("string");
  expect(actual!.length).toBeGreaterThan(0);
};
