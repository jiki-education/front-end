import { useEffect, useState } from "react";

export function useShouldAnimate(testSuiteResult: any) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (!testSuiteResult) {
      return;
    }
    setShouldAnimate(true);
  }, [testSuiteResult]);

  return { shouldAnimate };
}
