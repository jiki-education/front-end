import { jikiscript, javascript, python } from "@jiki/interpreters";

describe("interpreters package import", () => {
  it("should export jikiscript namespace with interpret and compile", () => {
    expect(jikiscript).toBeDefined();
    expect(typeof jikiscript.interpret).toBe("function");
    expect(typeof jikiscript.compile).toBe("function");
  });

  it("should export javascript namespace with interpret", () => {
    expect(javascript).toBeDefined();
    expect(typeof javascript.interpret).toBe("function");
  });

  it("should export python namespace with interpret", () => {
    expect(python).toBeDefined();
    expect(typeof python.interpret).toBe("function");
  });

  it("should be able to call jikiscript.interpret without errors", () => {
    // Just test that calling the function doesn't throw
    // The result may vary based on the code syntax
    expect(() => {
      jikiscript.interpret('print("Hello")');
    }).not.toThrow();
  });

  it("should be able to call jikiscript.compile without errors", () => {
    // Just test that calling the function doesn't throw
    expect(() => {
      jikiscript.compile('print("Hello")');
    }).not.toThrow();
  });
});
