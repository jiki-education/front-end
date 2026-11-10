import { headlineScaleFor } from "@/components/landing-page/hero/headlineFit";

describe("headlineScaleFor", () => {
  it("renders English at full size", () => {
    expect(headlineScaleFor("en")).toBe(1);
  });

  it("shrinks a locale whose highlight is too long for one line", () => {
    expect(headlineScaleFor("hu")).toBeLessThan(1);
  });

  it("renders an unlisted locale at full size", () => {
    expect(headlineScaleFor("xx")).toBe(1);
  });
});
