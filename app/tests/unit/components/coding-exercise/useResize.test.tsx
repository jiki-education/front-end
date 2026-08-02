import { useResizablePanels } from "@/components/coding-exercise/useResize";
import "@testing-library/jest-dom";
import { act, renderHook } from "@testing-library/react";

// The vertical divider maps a horizontal drag to the LHS (editor) panel's share.
// That share is always measured from the PHYSICAL left edge: the exercise split
// deliberately does not mirror under RTL (the container is pinned to
// `direction: ltr`), so the editor stays left and the RHS stays right in every
// locale. These tests wire real DOM nodes to the hook's refs and drive
// document-level mouse events to assert the math and the physical positioning.

// Width 2000 so the LHS_MIN_PIXELS (400) clamp resolves to the 30% floor
// rather than pinning every drag to a single value.
const CONTAINER_RECT = {
  left: 0,
  right: 2000,
  width: 2000,
  top: 0,
  bottom: 300,
  height: 300,
  x: 0,
  y: 0,
  toJSON: () => {}
} as DOMRect;

function setup(direction: "ltr" | "rtl") {
  const container = document.createElement("div");
  const divider = document.createElement("button");
  container.getBoundingClientRect = jest.fn(() => CONTAINER_RECT);

  jest
    .spyOn(window, "getComputedStyle")
    .mockImplementation((el: Element) => ({ direction: el === container ? direction : "ltr" }) as CSSStyleDeclaration);

  const { result } = renderHook(() => useResizablePanels());
  // Point the hook's refs at our detached nodes.
  (result.current.containerRef as { current: HTMLDivElement }).current = container;
  (result.current.verticalDividerRef as { current: HTMLButtonElement }).current = divider;

  return { result, container, divider };
}

function drag(result: ReturnType<typeof setup>["result"], clientX: number) {
  act(() => {
    result.current.handleVerticalMouseDown({
      preventDefault: jest.fn(),
      clientX
    } as unknown as React.MouseEvent);
  });
  act(() => {
    document.dispatchEvent(new MouseEvent("mousemove", { clientX }));
    document.dispatchEvent(new MouseEvent("mouseup"));
  });
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useResizablePanels vertical divider", () => {
  it("LTR: measures the LHS share from the left edge", () => {
    const { result, divider } = setup("ltr");

    // clientX=1000 is 1000px from the left (0) → 50% of 2000.
    drag(result, 1000);

    expect(divider.style.left).toBe("50%");
    // The logical property must not be set — under RTL it would resolve to the
    // right edge and un-pin the split.
    expect(divider.style.insetInlineStart).toBe("");
  });

  it("RTL: still measures the LHS share from the physical left edge", () => {
    const { result, divider } = setup("rtl");

    // clientX=1000 is 1000px from the left (0) → 50%, exactly as in LTR.
    drag(result, 1000);
    expect(divider.style.left).toBe("50%");

    // clientX=400 is 400px from the left → 20%, clamped up to the 30% minimum.
    drag(result, 400);
    expect(divider.style.left).toBe("30%");
    expect(divider.style.insetInlineStart).toBe("");
  });

  it("RTL and LTR resolve identically for the same pointer position", () => {
    // clientX=1600 → 80% from the left, clamped to the 70% max, in both
    // directions: the split does not mirror.
    const ltr = setup("ltr");
    drag(ltr.result, 1600);
    expect(ltr.divider.style.left).toBe("70%");

    jest.restoreAllMocks();

    const rtl = setup("rtl");
    drag(rtl.result, 1600);
    expect(rtl.divider.style.left).toBe("70%");
  });

  it("applies the LHS share to the grid tracks in both directions", () => {
    const ltr = setup("ltr");
    drag(ltr.result, 1000);
    expect(ltr.container.style.gridTemplateColumns).toBe("1fr 1fr");
    expect(ltr.container.style.getPropertyValue("--lhs-width")).toBe("50%");

    jest.restoreAllMocks();

    const rtl = setup("rtl");
    drag(rtl.result, 1000);
    expect(rtl.container.style.gridTemplateColumns).toBe("1fr 1fr");
    expect(rtl.container.style.getPropertyValue("--lhs-width")).toBe("50%");
  });
});
