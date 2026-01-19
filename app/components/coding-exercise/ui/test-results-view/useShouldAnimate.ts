import { useEffect, useState } from "react";

export function useShouldAnimate(testSuiteResult: any) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  // Trigger animation when test results arrive - one-time state transition
  useEffect(() => {
    if (!testSuiteResult) {
      return;
    }
    setShouldAnimate(true);
  }, [testSuiteResult]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return { shouldAnimate };
}
