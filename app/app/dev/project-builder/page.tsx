"use client";

import ProjectBuilder from "@/components/project-builder/ProjectBuilder";
import type { LessonConfig } from "@/components/project-builder/lib/types";

const LESSON: LessonConfig = {
  slug: "dev-personal-homepage",
  title: "Your personal homepage",
  instructions: `The learner is building their first personal homepage from a minimal starting point. The arc: a headline about themselves, some styling (colors, fonts, spacing), and a fun interactive button that fires confetti. They have never written code before this course.`,
  agentGuidance: `Start by asking what they want their homepage to say about them. Good early steps: changing the headline text, picking colors, adding a short "about me" paragraph. The confetti button is a later reward - it needs a main.js wired up as a module and the canvas-confetti library.`,
  startingFiles: {
    "index.html": `<!doctype html>
<html>
  <head>
    <title>My homepage</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>Welcome</h1>
    <script type="module" src="main.js"></script>
  </body>
</html>
`,
    "style.css": `body {
  font-family: sans-serif;
  margin: 40px;
}
`,
    "main.js": `// Your JavaScript will go here.
`
  },
  allowedLibraries: [{ name: "canvas-confetti", path: "/static/vendor/canvas-confetti-1.9.3.mjs" }]
};

export default function ProjectBuilderDevPage() {
  return <ProjectBuilder lesson={LESSON} />;
}
