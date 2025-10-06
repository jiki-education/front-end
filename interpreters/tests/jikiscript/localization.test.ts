import { scan } from "@jikiscript/scanner";
import { changeLanguage, getLanguage } from "@jikiscript/translator";

async function usingLanguage(newLanguage: string, callback: () => void) {
  const oldLanguage = getLanguage();
  try {
    await changeLanguage(newLanguage);
    callback();
  } finally {
    await changeLanguage(oldLanguage);
  }
}

describe("scanner", () => {
  describe("error", () => {
    test.each([["en", "Unknown character: '#'."]])(
      "translated to '%s'",
      async (language: string, expectedErrorMessage: string) => {
        usingLanguage(language, () => {
          expect(() => scan("123#")).toThrow(expectedErrorMessage);
        });
      }
    );
  });
});
