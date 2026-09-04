import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CodeSyncChoiceModal } from "@/lib/modal/modals/CodeSyncChoiceModal";
import { hideModal } from "@/lib/modal/store";

jest.mock("@/lib/modal/store", () => {
  const actual = jest.requireActual("@/lib/modal/store");
  return {
    ...actual,
    hideModal: jest.fn()
  };
});

describe("CodeSyncChoiceModal", () => {
  beforeEach(() => {
    (hideModal as jest.Mock).mockClear();
  });

  it("shows both versions of the code", () => {
    render(<CodeSyncChoiceModal localCode="local code" serverCode="server code" onChoose={jest.fn()} />);

    expect(screen.getByText("local code")).toBeInTheDocument();
    expect(screen.getByText("server code")).toBeInTheDocument();
  });

  it("highlights only the differing lines", () => {
    render(<CodeSyncChoiceModal localCode={"same\nold"} serverCode={"same\nnew"} onChoose={jest.fn()} />);

    expect(screen.getByText("old").className).toContain("changed");
    expect(screen.getByText("new").className).toContain("changed");
    for (const el of screen.getAllByText("same")) {
      expect(el.className).not.toContain("changed");
    }
  });

  it("keeps the panes aligned with a spacer where one side has an extra line", () => {
    const { container } = render(
      <CodeSyncChoiceModal localCode={"same\nextra"} serverCode={"same"} onChoose={jest.fn()} />
    );

    const panes = container.querySelectorAll("pre");
    expect(panes[0].children).toHaveLength(2);
    expect(panes[1].children).toHaveLength(2);
    expect(panes[1].children[1].className).toContain("spacer");
  });

  it("reports the local choice and closes", () => {
    const onChoose = jest.fn();
    render(<CodeSyncChoiceModal localCode="local code" serverCode="server code" onChoose={onChoose} />);

    fireEvent.click(screen.getByText("Use this device's code"));

    expect(onChoose).toHaveBeenCalledWith("local");
    expect(hideModal).toHaveBeenCalled();
  });

  it("reports the server choice and closes", () => {
    const onChoose = jest.fn();
    render(<CodeSyncChoiceModal localCode="local code" serverCode="server code" onChoose={onChoose} />);

    fireEvent.click(screen.getByText("Use latest version"));

    expect(onChoose).toHaveBeenCalledWith("server");
    expect(hideModal).toHaveBeenCalled();
  });
});
