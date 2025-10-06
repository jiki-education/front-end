# Python Interpreter

The Python interpreter for Jiki provides educational visualization of Python code execution with frame-by-frame analysis.

## Current Status

**Fully Functional** - Core Python features implemented and tested

### Implemented Features

- **Numeric Literals**: Integer and floating-point numbers with scientific notation
- **Boolean Literals**: True/False values with logical operations
- **String Literals**: Single and double quoted strings with concatenation
- **Arithmetic Operations**: All Python operators (+, -, \*, /, //, %, \*\*)
- **Comparison Operations**: All comparison operators (>, >=, <, <=, ==, !=)
- **Logical Operations**: Python logical operators (and, or, not)
- **Grouping Expressions**: Parentheses for precedence control
- **Variable System**: Assignment (x = value) and access with proper scoping
- **Unary Negation**: Negation operator (-) for numbers and expressions with proper precedence
- **Control Flow**: Complete if/elif/else statement support with proper indentation handling
- **Loops**: For-in loops with break and continue statements
- **Code Blocks**: Python-style indented blocks with 4-space enforcement
- **Lists**: Creation, indexing (with negative indices), element assignment, and iteration
- **User-Defined Functions**: Function declaration with `def`, return statements, closures, parameter binding
- **Runtime Error Handling**: Undefined variable detection and type checking with educational messages
- **Complete Scanner**: Tokenizes all implemented Python syntax including INDENT/DEDENT tokens
- **Recursive Parser**: Builds correct AST with Python operator precedence and block structures
- **Modular Executor**: Comprehensive coverage including control flow, functions, and data structures
- **PyObjects**: Python-specific objects (PyNumber, PyString, PyBoolean, PyList, PyNone)
- **Frame Generation**: Educational step-by-step execution visualization

### Planned Features

- While loops
- Dictionaries and tuples
- Advanced function features (default parameters, \*args, \*\*kwargs, lambda)
- String methods and f-strings
- Classes and objects

## Architecture

The Python interpreter follows the same modular architecture as JavaScript and JikiScript:

```
Source Code → Scanner → Parser → Executor → Frames → UI
```

### Integration with Shared Components

- **Frames**: Uses unified frame system from `src/shared/frames.ts`
- **Objects**: Extends `JikiObject` base class for consistency
- **Testing**: Follows established patterns from JavaScript interpreter
- **Educational Features**: Provides descriptions and step-by-step execution

For detailed architecture information, see `architecture.md`.

## Educational Focus

The Python interpreter emphasizes:

- **Beginner-Friendly**: Clear error messages and execution explanations
- **Visual Learning**: Frame-by-frame execution with variable tracking
- **Progressive Syntax**: Gradual introduction of Python concepts
- **Cross-Language Consistency**: Same UI experience as other Jiki interpreters
