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

### TODO

- while loops
- f-strings
- Dictionaries (called Dictionary internally)
- Default parameter values
- Keyword arguments
- Variable-length argument lists (\*args, \*\*kwargs)
- Lambda expressions

## Built-in Functions

### Including

#### Implemented

- None yet

#### TODO (Essential - High Priority)

- `print()` - Fundamental for output
- `input()` - Basic user interaction
- `len()` - Working with sequences
- `range()` - Loop iteration
- `int()` - Type conversion to integer
- `float()` - Type conversion to float
- `str()` - Type conversion to string
- `bool()` - Type conversion to boolean
- `type()` - Get type of object
- `abs()` - Absolute value
- `round()` - Round numbers
- `min()` - Find minimum value
- `max()` - Find maximum value
- `sum()` - Sum of iterable

#### TODO (Important - Medium Priority)

- `list()` - Create list from iterable
- `tuple()` - Create tuple from iterable
- `dict()` - Create dictionary
- `sorted()` - Return sorted list
- `reversed()` - Return reversed iterator
- `enumerate()` - Return enumerate object for indexed iteration
- `zip()` - Combine multiple iterables
- `all()` - Check if all elements are truthy
- `any()` - Check if any element is truthy
- `pow()` - Power function (though \*\* operator exists)

#### TODO (Nice to Have - Lower Priority)

- `chr()` - Convert integer to character
- `ord()` - Convert character to integer
- `bin()` - Convert to binary string
- `hex()` - Convert to hexadecimal string
- `oct()` - Convert to octal string
- `map()` - Apply function to iterable
- `filter()` - Filter iterable by function
- `repr()` - String representation of object
- `divmod()` - Division and modulo
- `isinstance()` - Check instance type

### Excluding

These functions are too advanced for a beginner-focused educational interpreter:

- `aiter()` - Async iteration
- `anext()` - Async next
- `ascii()` - ASCII representation
- `breakpoint()` - Debugging breakpoint
- `bytearray()` - Mutable byte sequence
- `bytes()` - Immutable byte sequence
- `callable()` - Check if object is callable
- `classmethod()` - Class method decorator
- `compile()` - Compile source to code object
- `complex()` - Complex numbers
- `delattr()` - Delete attribute
- `dir()` - List attributes
- `eval()` - Evaluate expression
- `exec()` - Execute code
- `format()` - Format specification
- `frozenset()` - Immutable set
- `getattr()` - Get attribute
- `globals()` - Global namespace
- `hasattr()` - Check attribute existence
- `hash()` - Hash value
- `help()` - Interactive help
- `id()` - Object identity
- `issubclass()` - Check subclass
- `iter()` - Iterator object
- `locals()` - Local namespace
- `memoryview()` - Memory view object
- `next()` - Next item from iterator
- `object()` - Base object
- `open()` - File operations
- `property()` - Property decorator
- `set()` - Set object
- `setattr()` - Set attribute
- `slice()` - Slice object
- `staticmethod()` - Static method decorator
- `super()` - Super class access
- `vars()` - Object's **dict**
- `__import__()` - Import mechanism

## Implementation Notes

- Functions should follow Python semantics as closely as possible
- Error messages should be educational and clear
- Each function should generate appropriate frames for the Jiki UI
- Type checking should be consistent with Python's duck typing when appropriate
- Consider language feature flags for strict vs. loose behavior
