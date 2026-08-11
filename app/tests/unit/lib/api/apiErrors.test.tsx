/**
 * Unit tests for the API error copy resolver.
 * Covers type lookup, context scoping, extras interpolation, and the fallback.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { ApiErrorMessage } from "@/lib/api/apiErrors";
import { ApiError, NetworkError } from "@/lib/api/client";

function apiError(body: unknown, status = 422) {
  return new ApiError(status, "Unprocessable Entity", body);
}

describe("ApiErrorMessage", () => {
  it("renders the copy for the type the API sent", () => {
    render(<ApiErrorMessage error={apiError({ error: { type: "no_subscription" } })} />);
    expect(screen.getByText("You haven't got an active subscription")).toBeInTheDocument();
  });

  it("prefers the scoped entry when a context is given", () => {
    render(<ApiErrorMessage error={apiError({ error: { type: "unauthorized" } })} context="subscriptions" />);
    expect(screen.getByText("That checkout session belongs to a different account")).toBeInTheDocument();
  });

  it("falls back to the unscoped entry when the context has no override", () => {
    render(<ApiErrorMessage error={apiError({ error: { type: "no_subscription" } })} context="subscriptions" />);
    expect(screen.getByText("You haven't got an active subscription")).toBeInTheDocument();
  });

  it("gives the same type different copy in a different context", () => {
    const error = apiError({ error: { type: "stripe_error" } });
    const { unmount } = render(<ApiErrorMessage error={error} context="subscriptions" />);
    expect(screen.getByText("Something went wrong taking your payment. Please try again.")).toBeInTheDocument();
    unmount();

    render(<ApiErrorMessage error={error} context="accountDeletion" />);
    expect(screen.getByText(/we haven't deleted your account/)).toBeInTheDocument();
  });

  it("interpolates structured extras, camelizing the wire keys", () => {
    const error = apiError({ error: { type: "file_too_large", filename: "main.jsx", max_bytes: 5000 } });
    render(<ApiErrorMessage error={error} />);
    // The byte count is number-formatted by ICU at render time, so match around it.
    expect(screen.getByText(/^main\.jsx is too large\. Files can be up to .* bytes\.$/)).toBeInTheDocument();
  });

  it("joins array extras", () => {
    const error = apiError({ error: { type: "duplicate_filename", filenames: ["a.js", "b.js"] } });
    render(<ApiErrorMessage error={error} />);
    expect(screen.getByText("You've used the same filename more than once: a.js, b.js")).toBeInTheDocument();
  });

  it("prefers the entry for a reason when the API sent one", () => {
    render(<ApiErrorMessage error={apiError({ error: { type: "invalid_submission", reason: "no_files" } })} />);
    expect(screen.getByText("Add at least one file before submitting.")).toBeInTheDocument();
  });

  it("falls back to the type's own copy for an unrecognised reason", () => {
    render(<ApiErrorMessage error={apiError({ error: { type: "invalid_submission", reason: "something_new" } })} />);
    expect(screen.getByText("We couldn't accept that submission.")).toBeInTheDocument();
  });

  describe("validation_error / *_update_failed field errors", () => {
    it("names the field and the failure", () => {
      const error = apiError({
        error: { type: "validation_error", errors: { email: [{ error: "invalid" }] } }
      });
      render(<ApiErrorMessage error={error} />);
      expect(screen.getByText("Email address isn't valid.")).toBeInTheDocument();
    });

    it("interpolates the count on a length failure", () => {
      const error = apiError({
        error: { type: "validation_error", errors: { password: [{ error: "too_short", count: 8 }] } }
      });
      render(<ApiErrorMessage error={error} />);
      expect(screen.getByText("Password must be at least 8 characters.")).toBeInTheDocument();
    });

    it("reports every failing field", () => {
      const error = apiError({
        error: {
          type: "validation_error",
          errors: { email: [{ error: "taken" }], handle: [{ error: "blank" }] }
        }
      });
      render(<ApiErrorMessage error={error} />);
      expect(screen.getByText("Email address is already taken. Handle can't be blank.")).toBeInTheDocument();
    });

    it("drops a field it cannot name rather than showing the wire key", () => {
      const error = apiError({
        error: {
          type: "validation_error",
          errors: { some_internal_column: [{ error: "invalid" }], email: [{ error: "blank" }] }
        }
      });
      render(<ApiErrorMessage error={error} />);
      expect(screen.getByText("Email address can't be blank.")).toBeInTheDocument();
    });

    it("falls back to the generic line when nothing resolves", () => {
      const error = apiError({
        error: { type: "validation_error", errors: { some_internal_column: [{ error: "whatever" }] } }
      });
      render(<ApiErrorMessage error={error} />);
      expect(screen.getByText("Please check what you entered and try again.")).toBeInTheDocument();
    });

    it("prefers field detail over a *_update_failed type's own copy", () => {
      const error = apiError({
        error: { type: "handle_update_failed", errors: { handle: [{ error: "taken" }] } }
      });
      render(<ApiErrorMessage error={error} />);
      expect(screen.getByText("Handle is already taken.")).toBeInTheDocument();
    });

    it("reads the reshaped boolean_required detail", () => {
      const error = apiError({
        error: { type: "streaks_update_failed", errors: { enabled: [{ error: "boolean_required" }] } }
      });
      render(<ApiErrorMessage error={error} />);
      expect(screen.getByText("That setting can only be on or off.")).toBeInTheDocument();
    });

    it("never renders the echoed value", () => {
      const error = apiError({
        error: { type: "validation_error", errors: { email: [{ error: "invalid", value: "nope@@" }] } }
      });
      render(<ApiErrorMessage error={error} />);
      expect(screen.getByText("Email address isn't valid.")).toBeInTheDocument();
      expect(screen.queryByText(/nope@@/)).not.toBeInTheDocument();
    });

    it("falls back to the type's own copy when nothing in errors resolves", () => {
      const error = apiError({
        error: { type: "handle_update_failed", errors: { some_internal_column: [{ error: "whatever" }] } }
      });
      render(<ApiErrorMessage error={error} />);
      expect(screen.getByText("We couldn't change your handle")).toBeInTheDocument();
    });

    it("falls back to the generic line when the type sends no errors hash", () => {
      render(<ApiErrorMessage error={apiError({ error: { type: "validation_error" } })} />);
      expect(screen.getByText("Please check what you entered and try again.")).toBeInTheDocument();
    });
  });

  it("falls back to the generic message for a type with no entry", () => {
    render(<ApiErrorMessage error={apiError({ error: { type: "some_type_we_have_never_seen" } })} />);
    expect(screen.getByText("Something went wrong. Please try again.")).toBeInTheDocument();
  });

  it("falls back to the generic message for a non-API error", () => {
    render(<ApiErrorMessage error={new NetworkError("offline")} />);
    expect(screen.getByText("Something went wrong. Please try again.")).toBeInTheDocument();
  });
});
