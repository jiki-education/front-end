import { hasSeenIntroVideo, markIntroVideoSeen } from "@/lib/exercises/introVideoSeen";

describe("introVideoSeen", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reports an unseen exercise as unseen", () => {
    expect(hasSeenIntroVideo("fix-wall")).toBe(false);
  });

  it("remembers an exercise once marked, without affecting others", () => {
    markIntroVideoSeen("fix-wall");

    expect(hasSeenIntroVideo("fix-wall")).toBe(true);
    expect(hasSeenIntroVideo("build-wall")).toBe(false);
  });

  it("treats unavailable storage as seen, so nobody is trapped behind the modal", () => {
    const getItem = jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    expect(hasSeenIntroVideo("fix-wall")).toBe(true);

    getItem.mockRestore();
  });

  it("swallows a write failure rather than breaking the exercise load", () => {
    const setItem = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(() => markIntroVideoSeen("fix-wall")).not.toThrow();

    setItem.mockRestore();
  });
});
