import { useEffect, useState } from "react";

export function useShouldAnimate(testSuiteResult: any) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Trigger animation when test results arrive - one-time state transition
  useEffect(() => {
    if (!testSuiteResult) {
      return;
    }
    setShouldAnimate(true);
  }, [testSuiteResult]);

  return { shouldAnimate };
}
