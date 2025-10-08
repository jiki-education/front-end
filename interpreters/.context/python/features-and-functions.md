# Python Features and Functions

This document outlines the features and functions included in the educational Python interpreter for Jiki.

## Language Features

### Implemented

- Basic data types (int, float, str, bool, None)
- Variables (assignment and updates)
- Arithmetic operators (+, -, \*, /, //, %, \*\*)
- Comparison operators (<, <=, >, >=, ==, !=)
- Logical operators (and, or, not)
- Control flow (if, elif, else, for-in loops, break, continue)
- Indentation-based blocks
- Truthiness (configurable via language feature flag)
- Type coercion control (configurable via language feature flag)
- Comments
- Lists (creation, logging, index access with negative indexing, and element assignment)
- **User-defined functions** (def, return statements with closures and parameter binding)
- **while loops** (with break and continue support)
- **f-strings** (formatted string literals with expression interpolation)

### TODO

- Dictionaries (called Dictionary internally)
- Default parameter values
- Keyword arguments
- Variable-length argument lists (\*args, \*\*kwargs)
- Lambda expressions

## Built-in Functions and Methods

For a comprehensive list of all standard library functions and methods (both implemented and planned), see [STDLIB.md](../../STDLIB.md) in the root of the interpreters directory.

## Implementation Notes

- Functions should follow Python semantics as closely as possible
- Error messages should be educational and clear
- Each function should generate appropriate frames for the Jiki UI
- Type checking should be consistent with Python's duck typing when appropriate
- Consider language feature flags for strict vs. loose behavior
