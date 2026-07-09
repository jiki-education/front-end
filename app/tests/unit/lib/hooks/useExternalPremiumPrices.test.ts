import { renderHook, waitFor } from "@testing-library/react";
import { useExternalPremiumPrices } from "@/lib/hooks/useExternalPremiumPrices";
import { fetchExternalPricing } from "@/lib/api/externalPricing";
import { reportError } from "@/lib/reportError";

jest.mock("@/lib/api/externalPricing");
jest.mock("@/lib/reportError");

const mockFetchExternalPricing = fetchExternalPricing as jest.MockedFunction<typeof fetchExternalPricing>;
const mockReportError = reportError as jest.MockedFunction<typeof reportError>;

const PRICES = { currency: "gbp", monthly: 799, annual: 7900, country_code: "GB" };

describe("useExternalPremiumPrices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null then resolves to the fetched prices", async () => {
    mockFetchExternalPricing.mockResolvedValue({ premium_prices: PRICES });

    const { result } = renderHook(() => useExternalPremiumPrices());

    expect(result.current).toBeNull();
    await waitFor(() => expect(result.current).toEqual(PRICES));
  });

  it("does not fetch when disabled", () => {
    renderHook(() => useExternalPremiumPrices({ enabled: false }));

    expect(mockFetchExternalPricing).not.toHaveBeenCalled();
  });

  it("does not report a rejected fetch (TypeError network noise)", async () => {
    mockFetchExternalPricing.mockRejectedValue(new TypeError("Failed to fetch"));

    renderHook(() => useExternalPremiumPrices());

    await waitFor(() => expect(mockFetchExternalPricing).toHaveBeenCalled());
    expect(mockReportError).not.toHaveBeenCalled();
  });

  it("reports a real error (bad HTTP status)", async () => {
    const error = new Error("Failed to fetch external pricing (503)");
    mockFetchExternalPricing.mockRejectedValue(error);

    renderHook(() => useExternalPremiumPrices());

    await waitFor(() => expect(mockReportError).toHaveBeenCalledWith(error));
  });
});
