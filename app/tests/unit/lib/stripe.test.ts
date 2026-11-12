import type * as StripeModule from "@/lib/stripe";

const mockLoadStripe = jest.fn();
jest.mock("@stripe/stripe-js/pure", () => ({ loadStripe: (...args: unknown[]) => mockLoadStripe(...args) }));

// The publishable key is read when the module loads, so each test loads a fresh copy
function loadModule(key: string): typeof StripeModule {
  const original = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = key;
  let loaded: typeof StripeModule | undefined;
  jest.isolateModules(() => {
    loaded = jest.requireActual<typeof StripeModule>("@/lib/stripe");
  });
  if (original === undefined) {
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  } else {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = original;
  }
  return loaded!;
}

describe("getStripe", () => {
  beforeEach(() => {
    mockLoadStripe.mockReset();
  });

  it("loads Stripe.js once and shares the instance", async () => {
    const stripe = { id: "stripe" };
    mockLoadStripe.mockResolvedValue(stripe);
    const { getStripe } = loadModule("pk_test_123");

    await expect(getStripe()).resolves.toBe(stripe);
    await expect(getStripe()).resolves.toBe(stripe);

    expect(mockLoadStripe).toHaveBeenCalledTimes(1);
    expect(mockLoadStripe).toHaveBeenCalledWith("pk_test_123");
  });

  it("loads Stripe.js again after a failed load", async () => {
    const stripe = { id: "stripe" };
    mockLoadStripe.mockRejectedValueOnce(new Error("Failed to load Stripe.js")).mockResolvedValueOnce(stripe);
    const { getStripe } = loadModule("pk_test_123");

    await expect(getStripe()).rejects.toThrow("Failed to load Stripe.js");
    await expect(getStripe()).resolves.toBe(stripe);

    expect(mockLoadStripe).toHaveBeenCalledTimes(2);
  });

  it("resolves to null without a publishable key", async () => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    const { getStripe } = loadModule("");

    await expect(getStripe()).resolves.toBeNull();
    expect(mockLoadStripe).not.toHaveBeenCalled();
  });

  it("does nothing on import, and preloadStripe swallows a failure", async () => {
    mockLoadStripe.mockRejectedValue(new Error("Failed to load Stripe.js"));
    const { preloadStripe } = loadModule("pk_test_123");
    expect(mockLoadStripe).not.toHaveBeenCalled();

    expect(() => preloadStripe()).not.toThrow();
    await Promise.resolve();

    expect(mockLoadStripe).toHaveBeenCalledTimes(1);
  });
});
