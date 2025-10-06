import { render } from "@testing-library/react";
import React from "react";

interface RenderCounterProps {
  children: React.ReactNode;
  onRender?: () => void;
}

export function RenderCounter({ children, onRender }: RenderCounterProps) {
  const renderCount = React.useRef(0);

  React.useEffect(() => {
    renderCount.current += 1;
    onRender?.();
  });

  return <>{children}</>;
}

export function createRenderCounter() {
  let count = 0;

  const increment = () => {
    count += 1;
  };

  const getCount = () => count;
  const reset = () => {
    count = 0;
  };

  return { increment, getCount, reset };
}

export function renderWithCounter(component: React.ReactElement, options?: Parameters<typeof render>[1]) {
  const counter = createRenderCounter();

  const WrappedComponent = React.memo(() => <RenderCounter onRender={counter.increment}>{component}</RenderCounter>);
  WrappedComponent.displayName = "WrappedComponent";

  const result = render(<WrappedComponent />, options);

  // Override rerender to track renders properly
  const originalRerender = result.rerender;
  const rerender = (newComponent: React.ReactElement) => {
    const NewWrappedComponent = React.memo(() => (
      <RenderCounter onRender={counter.increment}>{newComponent}</RenderCounter>
    ));
    NewWrappedComponent.displayName = "NewWrappedComponent";
    originalRerender(<NewWrappedComponent />);
  };

  return {
    ...result,
    rerender,
    getRenderCount: counter.getCount,
    resetRenderCount: counter.reset
  };
}
