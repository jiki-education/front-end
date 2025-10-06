---
description: Execute the next todo task from TODO.md, optionally filtered by interpreter
argument-hint: [interpreter] (optional: jikiscript, javascript, or python)
---

Read the TODO.md file and execute the next uncompleted todo task. If an interpreter is specified as $1 (jikiscript, javascript, or python), only work on todos for that specific interpreter. Otherwise, work on the next available todo regardless of interpreter.

Follow the instructions at the top of TODO.md. Ensure to:

1. Understand the task fully
2. Check relevant .context/ documentation first
3. Implement the solution
4. Run tests to verify
5. Commit changes when complete

Current interpreter filter: $1
