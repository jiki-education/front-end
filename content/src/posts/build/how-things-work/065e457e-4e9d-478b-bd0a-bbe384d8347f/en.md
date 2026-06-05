---
title: "How the Jiki interpreter runs your code"
excerpt: "A deep dive into how the Jiki interpreter parses, evaluates, and animates your code one frame at a time."
seo:
  description: "Deep dive into the Jiki interpreter — how it runs code frame by frame."
  keywords: ["interpreter", "jiki", "deep dive"]
---

The Jiki interpreter is what makes the scrubber possible. Let's pop the hood and see how it actually works.

## What we cover

- Parsing source into an AST
- Stepping evaluation one frame at a time
- How frames get attached to source locations
