import { render } from "@testing-library/react";
import toast from "react-hot-toast";
import { toastError, toastSuccess } from "@/lib/toast";

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: Object.assign(jest.fn(), {
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn()
  })
}));

describe("keyed toast helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the translated message for a key", () => {
    toastError("subscription.checkoutSessionFailed");
    const element = (toast.error as jest.Mock).mock.calls[0][0];
    const { getByText } = render(element);
    expect(getByText("Failed to create checkout session")).toBeInTheDocument();
  });

  it("interpolates ICU values into the message", () => {
    toastSuccess("subscription.canceled", { date: "1/2/2030" });
    const element = (toast.success as jest.Mock).mock.calls[0][0];
    const { getByText } = render(element);
    expect(getByText(/keep access until 1\/2\/2030/)).toBeInTheDocument();
  });

  it("forwards toast options such as the dedup id", () => {
    toastError("exercise.submissionFailed", undefined, { id: "exercise-submission-error" });
    expect((toast.error as jest.Mock).mock.calls[0][1]).toEqual({ id: "exercise-submission-error" });
  });
});
