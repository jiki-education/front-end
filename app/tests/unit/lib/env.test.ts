describe("DEPLOY_ENV / isStaging", () => {
  const original = process.env.ENVIRONMENT;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.ENVIRONMENT;
    } else {
      process.env.ENVIRONMENT = original;
    }
    jest.resetModules();
  });

  async function load(value: string | undefined) {
    jest.resetModules();
    if (value === undefined) {
      delete process.env.ENVIRONMENT;
    } else {
      process.env.ENVIRONMENT = value;
    }
    return import("@/lib/env");
  }

  it("is staging only when ENVIRONMENT is exactly 'staging'", async () => {
    const mod = await load("staging");
    expect(mod.DEPLOY_ENV).toBe("staging");
    expect(mod.isStaging()).toBe(true);
  });

  it("defaults to production when ENVIRONMENT is unset", async () => {
    const mod = await load(undefined);
    expect(mod.DEPLOY_ENV).toBe("production");
    expect(mod.isStaging()).toBe(false);
  });

  it("fails safe to production for production and any unknown value", async () => {
    expect((await load("production")).isStaging()).toBe(false);
    expect((await load("preview")).isStaging()).toBe(false);
  });
});
