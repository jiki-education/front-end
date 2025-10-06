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

## JikiScript

[x] Implement

## JavaScript

For everything in here, base your work in the JikiScript interpreter.

- [x] Add numbers.
- [x] Add strings.
- [x] Add booleans.
- [x] Add basic operations for working with numbers, strings and booleans.
- [x] For all tokens that are in the scanner. If they're not currently used, raise an UnimplementedToken error (or a message that fits with our naming scheme). Add a test for each Token (in a dedicated test file for this purpose). Add info about this to the `.context` for future use.
- [x] Add variables. Reference the JikiScript implementation to see how things should be set up. For now, don't worry about scoping, etc. We'll add that next. Just implement `let`. Don't implement `const` or `var`. Make sure to add corrosponding parser and implementer concept tests. Also add syntax error tests. Look at the JikiScript tests for inspiration.
- [x] Add a block with scope. A variable defined via let in this scope should only exist inside the scope. For now, don't worry about shadowing. Remember to add concept tests and syntax error tests (e.g. an unclosing block). Look at the JikiScript tests for inspiration.
- [x] Add negation.
- [x] Add errors for missing variables, so if you do `5 + a` and there is no `a` that's a runtime error on that frame etc. For this you might need to add the ability to actually use variables if that's not defined yet. Make sure you read the .context file on how errors work.
- [x] Add errors for updating a variable before it's defined. That should be a runtime error on that frame. Don't worry about seeing if it's defined later. We're just wanting to say "We don't know about this `a` thing you're discussing"
- [x] Add a new language feature interpreter for allowShadowing. See language features for JikiScript to see how this works. If the feature is enabled, then inner variables can be created by let inside blocks to shadow outer variables. If it is false, then any attempt to shadow with let should result in a shadowing disabled runtime error. Remember to add tests for both cases. Look how runtime errors work in JikiScript. Be comprehensive with tests.
- [x] Add an if statement to the JavaScript interpreter. Add tests for parsing and executing. Ensure that any syntax errors are caught. Look at the JikiScript tests for examples.
- [x] Add `else` statements (they may already be there). Ensure they work with `else if`. Remember to add tests and check the JikiScript implementation as your base level.
- [x] Add comparison operators.
- [x] Add a language feature to the JavaScript interpreter for truthiness. See language features for JikiScript to see how this works. If enabled then truthiness should behave as normal in JS. If not, then only booleans (or functions/variables returning booleans etc) are allowed to be compared. If you compare non-booleans, a runtime error of TruthinessDisabled (or similar) should be added to the frame etc. Look how runtime errors work in JikiScript and the errors info in context. Consider that this probably only really needs to be checked in binary expressions.
- [x] Add a language feature for `requireVariableInstantiation`. If set to true then a variable has to be set with let. `let x;` is invalid. If `false`, then `let x;` is valid.
- [x] Add a language feature flag for allowTypeCoercion. When it's true, the normal semantics for JS with `5 + true` should give the same results as JS (we can execute this just by running the normal JS on the jikiObject values). However, if it's off, we should raise a TypeCoercionNotAllowed (or something similar) RunTime error on the frame. It should be off by default. Add a dedicated test file that tests this feature flag, and test it in as many different scnearios are appropraite. Both in terms of the normal behaviour (e.g. `5 + true` is differnet to `true + 5`) and in the disallowed case (in which case both of those should result in errors).
- [x] Add a language feature for `oneStatementPerLine` that, when true, means you are only allowed one statement per line. So effectively you are not allowed semicolons within a line - although there will be some exceptions (e.g. a for loop), but this is not really an exception as it's still one statement (a for statement) but it's inner has semicolons. Propose sensible approaches to this dilema with the Human.
- [x] Add a for loop. Look at the JikiScript implementation of repeat to get a feel.
- [x] Add a while loop. Look at the for loop implementation.
- [x] Add triple equals. Add a language feature for `enforceStrictEquality` which raises a custom error that we can use to tell the student that they need to use `===` not `==` if this is true. Set its default to `true`.
- [x] Add template literals.
- [x] Add null and undefined.
- [x] Add List. Ensure to look at JikiScript's implementation including clone(). For this task, only add the creation and logging of lists. Not index access.
- [x] Add list index reading. Look at JikiScript implementation for guidance.
- [x] Add list element writing. Look at JikiScript implementation for guidance. Follow JS rules for how this should work.
- [x] Ensure nested list work. Look at JikiScript implementation for guidance. Follow JS rules for how this should work.

- [x] Add object (call it a Dictionary internally as object is too broad and already overloaded). For this task, only add the creation and logging of objects. Not index access
- [x] Add object element reading. Look at JikiScript implementation for guidance. Follow JS rules for how this should work.
- [x] Add object element writing. Look at JikiScript implementation for guidance. Follow JS Rules for how this should work.
- [x] Ensure nested objects and lists work. Check for complex patterns like x[0].something[1]['foo'][5] = 'bar'. etc Look at JikiScript implementation for guidance.
- [x] Add properties and methods. Split the different JSTypes into their own files. Add a length property and at methods to Arrays. Note that this isn't a matter of adding these onto the JSArray, but on actually having a stdlib for Arrays that have these methods. So `[].length` should be parsed as a property expression (or whatever the correct name is), then the receiver (`[]` in this case) should have it's type asserted (array) and we should check the properties. If `length` didn't exist, we whould raise a custom error. Otherwise if it does, we should call the `length` code. In this case, that proxies to JSArray.Length, but that shouldn't be direct. We should have a mapping of `length: (executionCtx, obj) => { obj.length }` or something in the stdlib, and that properties method should be called with the current Execution Context (see Jikiscript for this) and the value returned. This is quite complex so be sure to take the time to understand this fully.
- [x] Add the ability to call external functions. Look at the JikiScript implementation of this. We'll use a standard CallExpression but we'll check to see if the function is external and use it if so. We need to keep the format the same in terms of using ExecutionContext etc. The same external functions contract needs to apply to all three languages and should be made generic.
- [x] Add the ability to create functions using the function keyword. Keep things very minimal for now. Only have normal args (not spread etc). Confirm exactly which options to support. Add return with or without a value. Don't worry about bindings (this etc) at this stage. Keep things close to JikiScript functions. Check that code.
- [x] Look at all JS stdlib methods on existing data types and implement a stub for each that raises a NotYetAvailable error, that says that this method isn't available to students yet in this exercise. Have a list of method names in an array that does this, rather than writing a stub for every one.
- [x] Add break and continue. Look at JikiScript for inspiration.
- [ ] Add for ... of ... loop.
- [ ] Add tests for `else if`
- [ ] Add const.
- [ ] Add Exponentiation.
- [ ] Add array mutating methods: `push()`, `pop()`, `shift()`, `unshift()`. These modify the array in place and should follow the stdlib pattern like `.length` and `.at()`. Look at `src/javascript/stdlib/arrays.ts` for the pattern.
- [ ] Add array query methods: `indexOf()`, `includes()`. These search the array and return values without mutating. Follow the same stdlib pattern.
- [ ] Add array transformation methods: `slice()`, `concat()`, `join()`. These create new values from the array. `slice()` and `concat()` return new arrays, `join()` returns a string.
- [ ] Add string `.length` property. Follow the same stdlib pattern as array `.length`.
- [ ] Add a console.log() stdlib method. How do we do this? Do we introduce a `console` global?

- [ ] Don't allow statements that don't actually do anything. For example, a statement that is just a variable. Or a grouping expression that doesn't have assignmennt. Add a TOOD that you will need to modify this for calling functions (which should just be allowed by themselves) later. Look at how this works in JikiScript as there is a specific type for it. You may need to update lots of tests where this is the case. For now you can just add a `let foo = "bar"` for these to make them easy to find later.

## Python

- [x] Add basic scanning, parsing and exec of numbers for Python, using the same patterns as the JS and JikiScript interpteters. Add equivelent tests.
- [x] Add booleans
- [x] Add strings
- [x] For all tokens that are in the scanner. If they're not currently used, raise an UnimplementedToken error (or a message that fits with our naming scheme). Add a test for each Token (in a dedicated test file for this purpose). Add info about this to the `.context` for future use.
- [x] Add basic grouping and other operations that are present to do with numbers/strings/bools in the JS implementation.
- [x] Add variables. Reference the JikiScript and JavaScript implementations to see how things should be set up. For now, don't worry about scoping, etc. We'll add that next. Just implement setting and updating of variables. Make sure to add corrosponding parser and implementer concept tests. Also add syntax error tests. Look at the JikiScript tests for inspiration.
- [x] Add errors for missing variables, so if you do `5 + a` and there is no `a` that's a runtime error on that frame etc.Don't worry about seeing if it's defined later. We're just wanting to say "We don't know about this `a` thing you're discussing
- [x] Add negation (-5)
- [x] Add an if statement. Add tests for parsing and executing. Ensure that any syntax errors are caught. Look at the JikiScript tests for examples. To do this, you'll also need to add block statements and indenting support in the parser. Carefully looked at JikiScript for how blocks work (better than JS as we don't have scopes to worry about here).
- [x] Add `else` and `elif` statements. Ensure they work together properly. Remember to add tests and check the JavaScript implementation as your base level.
- [x] Add comparison operators. Look at the JavaScript implementation.
- [x] Add negation (python's "not" boolean operator) - Implemented with full truthiness support
- [x] Add a language feature for truthiness in binary expressions. See the JavaScript one for an example. If enabled then truthiness should behave as normal in Python. If not, then only booleans (or functions/variables returning booleans etc) are allowed to be compared. If you compare non-booleans, a runtime error of TruthinessDisabled (or similar) should be added to the frame etc. Look how runtime errors work in JikiScript and the errors info in context. Note: Already implemented for NOT operator, needs to be added for binary expressions (and, or).
- [x] Add integer division if both numbers are integers. Are there any pitfalls we need to consider for numbers as JS stores all numbers as floats?
- [x] Add a language feature flag for allowTypeCoercion. Look at the JavaScript implementation. When it's true, the normal semantics for Python with `5 + true` should give the same results as Python. However, if it's off, we should raise a TypeCoercionNotAllowed (or something similar) RunTime error on the frame. It should be off by default. Add a dedicated test file that tests this feature flag, and test it in as many different scnearios are appropraite. Both in terms of the normal behaviour (e.g. `5 + true` is differnet to `true + 5`) and in the disallowed case (in which case both of those should result in errors).

- [x] Add List. Ensure to look at JikiScript and Javascript's implementation including clone(). For this task, only add the creation and logging of lists. Not index access.
- [x] Add list index reading. Look at JikiScript implementation for guidance. (Read the previous commit for context)
- [x] Add list element writing. Look at JikiScript implementation for guidance. Follow Python rules for how this should work.
- [x] Ensure nested list work. Look at JikiScript implementation for guidance. Follow Python rules for how this should work.

- [x] Add a for in loop. Look at the JikiScript implementation.
- [x] Add proper descriptions support to python liek we have in JikiScript. None of this "generateDescription" method nonsense. Proper describers that work properly like JikiScript.
- [x] Add the ability to call external functions. Look at the JavaScript implementation of this. We'll use a standard CallExpression but we'll check to see if the function is external and use it if so. We need to keep the format the same in terms of using ExecutionContext etc. The same external functions contract needs to apply to all three languages and should be made generic.
- [ ] Add a while loop. Look at the JavaScript implementation.
- [ ] Add fstrings
- [ ] Don't allow statements that don't actually do anything. For example, a statement that is just a variable. Or a grouping expression that doesn't have assignment. Add a TOOD that you will need to modify this for calling functions (which should just be allowed by themselves) later. Look at how this works in JikiScript as there is a specific type for it.
- [ ] Implement the next Python built-in function from [.context/python/features-and-functions.md](.context/python/features-and-functions.md). Only mark this as complete when all functions in the "Including" list are done. Ensure to move each function from TODO to Implemented in the context document when finished. Remember to confirm the plan with the human before implementing each function.
