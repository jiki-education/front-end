describe("Sanity Test", () => {
  it("should confirm that tests are running", () => {
    expect(1 + 1).toBe(2);
  });

  it("should confirm boolean values work", () => {
    expect(true).toBe(true);
    expect(false).toBe(false);
  });

  it("should confirm string comparison works", () => {
    expect("test").toBe("test");
  });

  it("should confirm array operations work", () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr[0]).toBe(1);
  });

  it("should confirm object comparison works", () => {
    const obj = { test: "value" };
    expect(obj.test).toBe("value");
  });
});
