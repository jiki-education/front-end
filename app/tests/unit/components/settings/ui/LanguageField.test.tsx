/**
 * Unit tests for LanguageField (the settings language picker)
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageField from "@/components/settings/ui/LanguageField";

async function openPicker(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Edit" }));
}

describe("LanguageField", () => {
  // The endonym is whatever the language itself uses: Hungarian doesn't
  // capitalise language names, so it is "magyar", not "Magyar".
  it("shows the account's current language, not the browser's", () => {
    render(<LanguageField value="hu" onSave={jest.fn()} />);

    expect(screen.getByText("magyar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("falls back to the default locale for a value we don't serve", () => {
    render(<LanguageField value="zz" onSave={jest.fn()} />);

    expect(screen.getByText("English")).toBeInTheDocument();
  });

  // Saving then reloads the page (see LanguageField). That is not asserted
  // here: jsdom cannot navigate, and stubbing window.location to observe it
  // costs more than the one line it would guard. Covered by e2e if it ever
  // needs covering.
  it("saves the picked language", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn().mockResolvedValue(undefined);
    render(<LanguageField value="en" onSave={onSave} />);

    await openPicker(user);
    await user.click(screen.getByRole("button", { name: /magyar/i }));

    expect(onSave).toHaveBeenCalledWith("hu");
  });

  it("marks the active language and doesn't re-save it", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(<LanguageField value="hu" onSave={onSave} />);

    await openPicker(user);
    const active = screen.getByRole("button", { name: /magyar/i });
    expect(active).toHaveAttribute("aria-current", "true");

    await user.click(active);
    expect(onSave).not.toHaveBeenCalled();
  });

  it("keeps the picker open and reports the failure when saving fails", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn().mockRejectedValue(new Error("nope"));
    render(<LanguageField value="en" onSave={onSave} />);

    await openPicker(user);
    await user.click(screen.getByRole("button", { name: /magyar/i }));

    // The picker must stay open on failure: closing it would imply the change
    // took, and the row would then show a language the account isn't set to.
    expect(await screen.findByText(/couldn't change your language/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /magyar/i })).toBeInTheDocument();
  });

  it("lists unreleased languages without making them selectable", async () => {
    const user = userEvent.setup();
    render(<LanguageField value="en" onSave={jest.fn()} />);

    await openPicker(user);

    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    // Present as text, but not a control — nothing to tab to that can't act.
    expect(screen.getByText("Deutsch")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Deutsch/ })).not.toBeInTheDocument();
  });

  it("abandons the change on cancel", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(<LanguageField value="en" onSave={onSave} />);

    await openPicker(user);
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
});
