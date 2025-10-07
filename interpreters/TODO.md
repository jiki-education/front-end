# Agent Overview

Your job is to work through this file. Find the next jobs that is not crossed off and work on it.

⚠️⚠️ If asked to work on a TODO, you should follow these steps: ⚠️⚠️

1. Read this file and find the relevant todo.
2. Read the `.context` files for anything potentially relevant. These explain the architecture and common issues you face.
3. Look at how JikiScript does it.
4. Come up with an execution plan. The execution plan should include the steps in this list.
5. CONFIRM THE PLAN WITH THE HUMAN.
6. Once confirmed by the human, work on the task.
7. Ensure the tests all pass and the typescript types are correct.
8. Update the `.context` files to reflect what you've done.
9. Update this file to mark the TODO as complete
10. Switch to a feature branch.
11. Commit to git
12. Push to remote repository
13. Make a PR.

Important:

- Do not comment out any tests or run git with no-verify. Always solve problems.
- If you are unsure, or feel like you're going down a rabbit hole, stop and ask for advice and help.
- **When implementing new features, add cross-validation tests** in `tests/cross-validation/` to verify the implementation matches native language behavior. See `.context/shared/cross-validation.md` for details.

## JikiScript

[x] Implement

## JavaScript

For everything in here, base your work in the JikiScript interpreter.

- [x] Add break and continue. Look at JikiScript for inspiration.
- [x] Add for ... of ... loop.
- [ ] Add tests for `else if`
- [ ] Add const.
- [ ] Add Exponentiation.
- [ ] Add array mutating methods: `push()`, `pop()`, `shift()`, `unshift()`. These modify the array in place and should follow the stdlib pattern like `.length` and `.at()`. Look at `src/javascript/stdlib/arrays.ts` for the pattern.
- [ ] Add array query methods: `indexOf()`, `includes()`. These search the array and return values without mutating. Follow the same stdlib pattern.
- [ ] Add array transformation methods: `slice()`, `concat()`, `join()`. These create new values from the array. `slice()` and `concat()` return new arrays, `join()` returns a string.
- [ ] Add string `.length` property. Follow the same stdlib pattern as array `.length`.
- [ ] Add a console.log() stdlib method. How do we do this? Do we introduce a `console` global?
- [ ] Don't allow statements that don't actually do anything. For example, a statement that is just a variable. Or a grouping expression that doesn't have assignmennt. Add a TOOD that you will need to modify this for calling functions (which should just be allowed by themselves) later. Look at how this works in JikiScript as there is a specific type for it. You may need to update lots of tests where this is the case. For now you can just add a `let foo = "bar"` for these to make them easy to find later.
- [ ] Implement equivalent tests to the Numbers block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Strings block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Variable Assignment block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Equality Operators block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Function Definitions block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Function Calls block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the If Statements block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the For Each Loops block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Repeat Loops block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Lists block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Dictionaries block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Method Calls block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Classes block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Keywords block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Brackets block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the General Parsing Errors block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for JavaScript. Look at the JikiScript implementation of how this error message is managed.

## Python

- [x] Add the ability to call external functions. Look at the JavaScript implementation of this. We'll use a standard CallExpression but we'll check to see if the function is external and use it if so. We need to keep the format the same in terms of using ExecutionContext etc. The same external functions contract needs to apply to all three languages and should be made generic.
- [ ] Add a while loop. Look at the JavaScript implementation.
- [ ] Add fstrings
- [ ] Don't allow statements that don't actually do anything. For example, a statement that is just a variable. Or a grouping expression that doesn't have assignment. Add a TOOD that you will need to modify this for calling functions (which should just be allowed by themselves) later. Look at how this works in JikiScript as there is a specific type for it.
- [ ] Implement the next Python built-in function from [.context/python/features-and-functions.md](.context/python/features-and-functions.md). Only mark this as complete when all functions in the "Including" list are done. Ensure to move each function from TODO to Implemented in the context document when finished. Remember to confirm the plan with the human before implementing each function.
- [ ] Implement equivalent tests to the Numbers block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Strings block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Variable Assignment block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Equality Operators block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Function Definitions block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Function Calls block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the If Statements block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the For Each Loops block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Repeat Loops block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Lists block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Dictionaries block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Method Calls block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Classes block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Keywords block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the Brackets block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
- [ ] Implement equivalent tests to the General Parsing Errors block in JikiScript's syntaxErrors.test.ts file. Only apply tests where the rules are appropriate for Python. Look at the JikiScript implementation of how this error message is managed.
