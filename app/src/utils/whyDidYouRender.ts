import React from "react";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Dynamic import is necessary to avoid bundling in production
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const whyDidYouRender = require("@welldone-software/why-did-you-render");

  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    trackExtraHooks: [["useOrchestratorStore", "useOrchestratorStore"]],
    logOnDifferentValues: true,
    include: [/CodeMirror/, /ComplexExercise/],
    exclude: [/^Suspense/, /^Fragment/]
  });
}
