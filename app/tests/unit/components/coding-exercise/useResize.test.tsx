import { useResizablePanels } from "@/components/coding-exercise/useResize";
import "@testing-library/jest-dom";
import { act, renderHook } from "@testing-library/react";

// The vertical divider maps a horizontal drag to the LHS panel's share. Under
// LTR that share is measured from the left edge; under RTL, from the right edge
// (time/space runs right→left). These tests wire real DOM nodes to the hook's
// refs and drive document-level mouse events to assert the mirrored math.

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

    expect(divider.style.insetInlineStart).toBe("50%");
    // Physical `left` must not be set — it would win over the logical property
    // and break RTL positioning.
    expect(divider.style.left).toBe("");
  });

  it("RTL: measures the LHS share from the right edge", () => {
    const { result, divider } = setup("rtl");

    // clientX=1000 is 1000px from the right (2000) → 50%.
    drag(result, 1000);
    expect(divider.style.insetInlineStart).toBe("50%");

    // clientX=1600 is 400px from the right → 20%, clamped up to the 30% minimum.
    drag(result, 1600);
    expect(divider.style.insetInlineStart).toBe("30%");
  });

  it("RTL and LTR mirror each other for the same pointer position", () => {
    // clientX=500: LTR → 500px from left = 25% (clamped to 30% min);
    //              RTL → 1500px from right = 75% (clamped to 70% max).
    const ltr = setup("ltr");
    drag(ltr.result, 500);
    expect(ltr.divider.style.insetInlineStart).toBe("30%");

    jest.restoreAllMocks();

    const rtl = setup("rtl");
    drag(rtl.result, 500);
    expect(rtl.divider.style.insetInlineStart).toBe("70%");
  });
});
