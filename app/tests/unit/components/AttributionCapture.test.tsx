import { render } from "@testing-library/react";
import { AttributionCapture } from "@/components/AttributionCapture";
import { captureAttribution } from "@/lib/attribution";

jest.mock("@/lib/attribution", () => ({
  captureAttribution: jest.fn()
}));

const mockCaptureAttribution = captureAttribution as jest.MockedFunction<typeof captureAttribution>;

describe("AttributionCapture", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls captureAttribution on mount", () => {
    render(<AttributionCapture />);
    expect(mockCaptureAttribution).toHaveBeenCalledTimes(1);
  });

  it("renders nothing", () => {
    const { container } = render(<AttributionCapture />);
    expect(container.firstChild).toBeNull();
  });
});
