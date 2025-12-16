# Language Conversion Guide: Jiki ↔ JavaScript ↔ Python

## Overview

The Jiki curriculum supports three programming languages:

1. **Jikiscript** - English-syntax beginner language with explicit keywords
2. **JavaScript** - Industry-standard web language
3. **Python** - Popular general-purpose language

All exercises must provide solution and stub files for all three languages. This guide shows how to convert code between them.

## Naming Conventions

### Functions

**Rule:** Define in `snake_case`, auto-convert for JavaScript

| Jikiscript        | JavaScript      | Python            |
| ----------------- | --------------- | ----------------- |
| `move_forward()`  | `moveForward()` | `move_forward()`  |
| `turn_left()`     | `turnLeft()`    | `turn_left()`     |
| `is_letter()`     | `isLetter()`    | `is_letter()`     |
| `to_upper_case()` | `toUpperCase()` | `to_upper_case()` |

**In exercise definitions:** Always use `snake_case` - the interpreter converts to camelCase for JavaScript automatically.

### Variables

**Rule:** Same as functions - `snake_case` in Jiki/Python, `camelCase` in JavaScript

| Jikiscript         | JavaScript        | Python             |
| ------------------ | ----------------- | ------------------ |
| `was_space`        | `wasSpace`        | `was_space`        |
| `output_string`    | `outputString`    | `output_string`    |
| `current_position` | `currentPosition` | `current_position` |
| `is_valid`         | `isValid`         | `is_valid`         |

## Syntax Conversion Reference

### Function Definition

| Jikiscript                                                             | JavaScript                                                       | Python                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| `function name with param do`<br/>&nbsp;&nbsp;`return param`<br/>`end` | `function name(param) {`<br/>&nbsp;&nbsp;`return param;`<br/>`}` | `def name(param):`<br/>&nbsp;&nbsp;`return param` |

**Multiple parameters:**

| Jikiscript                                                           | JavaScript                                                     | Python                                          |
| -------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| `function add with a, b do`<br/>&nbsp;&nbsp;`return a + b`<br/>`end` | `function add(a, b) {`<br/>&nbsp;&nbsp;`return a + b;`<br/>`}` | `def add(a, b):`<br/>&nbsp;&nbsp;`return a + b` |

### Variable Declaration

| Jikiscript             | JavaScript            | Python            |
| ---------------------- | --------------------- | ----------------- |
| `set x to 5`           | `let x = 5;`          | `x = 5`           |
| `set name to "Alice"`  | `let name = "Alice";` | `name = "Alice"`  |
| `set is_valid to true` | `let isValid = true;` | `is_valid = True` |

### Variable Reassignment

| Jikiscript                  | JavaScript           | Python              |
| --------------------------- | -------------------- | ------------------- |
| `change x to 10`            | `x = 10;`            | `x = 10`            |
| `change count to count + 1` | `count = count + 1;` | `count = count + 1` |

### For-Each Loop

| Jikiscript                                                     | JavaScript                                                     | Python                                       |
| -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------- |
| `for each item in list do`<br/>&nbsp;&nbsp;`// code`<br/>`end` | `for (const item of list) {`<br/>&nbsp;&nbsp;`// code`<br/>`}` | `for item in list:`<br/>&nbsp;&nbsp;`# code` |

**String iteration:**

| Jikiscript                                                                | JavaScript                                                                | Python                                                  |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------- |
| `for each char in "hello" do`<br/>&nbsp;&nbsp;`// process char`<br/>`end` | `for (const char of "hello") {`<br/>&nbsp;&nbsp;`// process char`<br/>`}` | `for char in "hello":`<br/>&nbsp;&nbsp;`# process char` |

### If Statement

| Jikiscript                                        | JavaScript                                       | Python                               |
| ------------------------------------------------- | ------------------------------------------------ | ------------------------------------ |
| `if x > 5 do`<br/>&nbsp;&nbsp;`// code`<br/>`end` | `if (x > 5) {`<br/>&nbsp;&nbsp;`// code`<br/>`}` | `if x > 5:`<br/>&nbsp;&nbsp;`# code` |

### Else If / Else

| Jikiscript                                                                                                                                  | JavaScript                                                                                                                                     | Python                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `if x > 10 do`<br/>&nbsp;&nbsp;`// code`<br/>`else if x > 5 do`<br/>&nbsp;&nbsp;`// code`<br/>`else do`<br/>&nbsp;&nbsp;`// code`<br/>`end` | `if (x > 10) {`<br/>&nbsp;&nbsp;`// code`<br/>`} else if (x > 5) {`<br/>&nbsp;&nbsp;`// code`<br/>`} else {`<br/>&nbsp;&nbsp;`// code`<br/>`}` | `if x > 10:`<br/>&nbsp;&nbsp;`# code`<br/>`elif x > 5:`<br/>&nbsp;&nbsp;`# code`<br/>`else:`<br/>&nbsp;&nbsp;`# code` |

### Return Statement

| Jikiscript     | JavaScript      | Python         |
| -------------- | --------------- | -------------- |
| `return value` | `return value;` | `return value` |
| `return x + y` | `return x + y;` | `return x + y` |

### Comparison Operators

| Operation        | Jikiscript | JavaScript | Python |
| ---------------- | ---------- | ---------- | ------ |
| Equality         | `==`       | `===`      | `==`   |
| Inequality       | `!=`       | `!==`      | `!=`   |
| Greater than     | `>`        | `>`        | `>`    |
| Less than        | `<`        | `<`        | `<`    |
| Greater or equal | `>=`       | `>=`       | `>=`   |
| Less or equal    | `<=`       | `<=`       | `<=`   |

**Note:** JavaScript uses `===` for strict equality (recommended) and `==` for loose equality. Jiki uses `==` which maps to JavaScript's `===`.

### Logical Operators

| Operation | Jikiscript | JavaScript | Python |
| --------- | ---------- | ---------- | ------ |
| AND       | `and`      | `&&`       | `and`  |
| OR        | `or`       | `\|\|`     | `or`   |
| NOT       | `not`      | `!`        | `not`  |

### Boolean Values

| Value | Jikiscript | JavaScript | Python  |
| ----- | ---------- | ---------- | ------- |
| True  | `true`     | `true`     | `True`  |
| False | `false`    | `false`    | `False` |

### String Operations

| Operation     | Jikiscript           | JavaScript          | Python        |
| ------------- | -------------------- | ------------------- | ------------- |
| Concatenation | `concatenate(a, b)`  | `a + b`             | `a + b`       |
| Uppercase     | `to_upper_case(str)` | `str.toUpperCase()` | `str.upper()` |
| Lowercase     | `to_lower_case(str)` | `str.toLowerCase()` | `str.lower()` |

**Note:** Jiki uses function calls for string operations to keep syntax consistent. JavaScript and Python use native methods.

### Character/Letter Checking

| Operation       | Jikiscript             | JavaScript              | Python           |
| --------------- | ---------------------- | ----------------------- | ---------------- |
| Check if letter | Custom function needed | `/[a-zA-Z]/.test(char)` | `char.isalpha()` |

**Jiki example:**

```jiki
function is_letter with char do
  for each alpha in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" do
    if char == alpha do
      return true
    end
  end
  return false
end
```

**JavaScript example:**

```javascript
function isLetter(char) {
  return /[a-zA-Z]/.test(char);
}
```

**Python example:**

```python
def is_letter(char):
    return char.isalpha()
```

## Complete Example: Acronym Exercise

### Jikiscript Version

```jiki
function is_letter with letter do
  for each alpha_letter in to_upper_case("abcdefghijklmnopqrstuvwxyz") do
    if to_upper_case(letter) == to_upper_case(alpha_letter) do
      return true
    end
  end
  return false
end

function acronym with sentence do
  set output to ""
  set was_space to true

  for each letter in sentence do
    if letter == " " or letter == "-" do
      change was_space to true
    else if was_space and is_letter(letter) do
      change output to concatenate(output, letter)
      change was_space to false
    end
  end

  return to_upper_case(output)
end
```

### JavaScript Version

```javascript
function isLetter(letter) {
  return /[a-zA-Z]/.test(letter);
}

function acronym(sentence) {
  let output = "";
  let wasSpace = true;

  for (const letter of sentence) {
    if (letter === " " || letter === "-") {
      wasSpace = true;
    } else if (wasSpace && isLetter(letter)) {
      output = output + letter;
      wasSpace = false;
    }
  }

  return output.toUpperCase();
}
```

### Python Version

```python
def is_letter(letter):
    return letter.isalpha()

def acronym(sentence):
    output = ""
    was_space = True

    for letter in sentence:
        if letter == " " or letter == "-":
            was_space = True
        elif was_space and is_letter(letter):
            output = output + letter
            was_space = False

    return output.upper()
```

## Conversion Patterns

### Pattern 1: String Building

**Jikiscript:**

```jiki
set result to ""
change result to concatenate(result, "new")
```

**JavaScript:**

```javascript
let result = "";
result = result + "new";
```

**Python:**

```python
result = ""
result = result + "new"
```

### Pattern 2: Boolean Flag Tracking

**Jikiscript:**

```jiki
set found to false
if condition do
  change found to true
end
```

**JavaScript:**

```javascript
let found = false;
if (condition) {
  found = true;
}
```

**Python:**

```python
found = False
if condition:
    found = True
```

### Pattern 3: Character Iteration with Conditions

**Jikiscript:**

```jiki
for each char in text do
  if char == " " do
    // handle space
  else do
    // handle other
  end
end
```

**JavaScript:**

```javascript
for (const char of text) {
  if (char === " ") {
    // handle space
  } else {
    // handle other
  }
}
```

**Python:**

```python
for char in text:
    if char == " ":
        # handle space
    else:
        # handle other
```

### Pattern 4: Early Return

**Jikiscript:**

```jiki
function find_first with list do
  for each item in list do
    if item > 10 do
      return item
    end
  end
  return 0
end
```

**JavaScript:**

```javascript
function findFirst(list) {
  for (const item of list) {
    if (item > 10) {
      return item;
    }
  }
  return 0;
}
```

**Python:**

```python
def find_first(list):
    for item in list:
        if item > 10:
            return item
    return 0
```

## Stdlib Function Mapping

When exercises use level-provided stdlib functions, map them to native equivalents:

| Jiki Stdlib          | JavaScript Native   | Python Native |
| -------------------- | ------------------- | ------------- |
| `concatenate(a, b)`  | `a + b`             | `a + b`       |
| `to_upper_case(str)` | `str.toUpperCase()` | `str.upper()` |
| `to_lower_case(str)` | `str.toLowerCase()` | `str.lower()` |
| `length(str)`        | `str.length`        | `len(str)`    |

**Example in Jiki:**

```jiki
set result to concatenate("hello", " world")
set upper to to_upper_case(result)
```

**Equivalent in JavaScript:**

```javascript
let result = "hello" + " world";
let upper = result.toUpperCase();
```

**Equivalent in Python:**

```python
result = "hello" + " world"
upper = result.upper()
```

## Common Gotchas

### 1. Variable Naming

❌ **Wrong:**

```javascript
// Don't use snake_case in JavaScript
let was_space = true;
```

✅ **Correct:**

```javascript
// Use camelCase in JavaScript
let wasSpace = true;
```

### 2. Boolean Capitalization

❌ **Wrong:**

```python
# Python boolean capitalization matters
if x == true:  # Wrong - lowercase
```

✅ **Correct:**

```python
# Python uses capital T and F
if x == True:  # Correct - capital T
```

### 3. Semicolons

❌ **Wrong:**

```python
# Don't use semicolons in Python
result = x + y;
```

✅ **Correct:**

```python
# Python doesn't use semicolons
result = x + y
```

### 4. String Concatenation

❌ **Wrong:**

```javascript
// Don't use concatenate() in JavaScript
let result = concatenate("hello", "world");
```

✅ **Correct:**

```javascript
// Use native + operator
let result = "hello" + "world";
```

### 5. Equality Operators

❌ **Wrong:**

```javascript
// Don't use == in JavaScript (loose equality)
if (x == "5")
```

✅ **Correct:**

```javascript
// Use === for strict equality
if (x === "5")
```

## Conversion Checklist

When converting code between languages:

- [ ] Convert function names: `snake_case` ↔ `camelCase`
- [ ] Convert variable names: `snake_case` ↔ `camelCase`
- [ ] Update function definition syntax
- [ ] Update loop syntax
- [ ] Update conditional syntax
- [ ] Convert boolean values (Python: `True`/`False`)
- [ ] Replace stdlib functions with native equivalents (JS/Python)
- [ ] Update string operations
- [ ] Check equality operators (JS: use `===`)
- [ ] Add/remove semicolons appropriately
- [ ] Update logical operators (`and`/`or` ↔ `&&`/`||`)
- [ ] Verify indentation (especially for Python)

## Testing Conversions

After converting code, verify:

1. **Syntax validity** - Code compiles/parses without errors
2. **Naming consistency** - All names follow language conventions
3. **Functional equivalence** - All three versions produce identical results
4. **Style compliance** - Code follows language-specific best practices

Run the test suite to validate:

```bash
pnpm test:curriculum
```

All scenarios should pass for all three languages.
