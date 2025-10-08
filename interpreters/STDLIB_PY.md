# Python Standard Library Reference

This document lists all standard library methods for the Python interpreter. Methods are organized by the object/type they act on. Use checkboxes to track implementation status.

## Globals (Built-in Functions)

### Type Conversion

- [x] print()
- [ ] input()
- [ ] int()
- [ ] float()
- [ ] str()
- [ ] bool()
- [ ] list()
- [ ] tuple()
- [ ] dict()

### Numeric Functions

- [ ] abs()
- [ ] round()
- [ ] pow()
- [ ] min()
- [ ] max()
- [ ] sum()
- [ ] divmod()

### Sequence & Iteration Functions

- [ ] len()
- [ ] range()
- [ ] sorted()
- [ ] reversed()
- [ ] enumerate()
- [ ] zip()
- [ ] filter()
- [ ] map()

### Logic Functions

- [ ] all()
- [ ] any()

### Object & Type Functions

- [ ] type()
- [ ] isinstance()

### String Functions

- [ ] chr()
- [ ] ord()

### Not planned

- set()
- frozenset()
- complex()
- issubclass()
- callable()
- id()
- hash()
- bin()
- hex()
- oct()
- ascii()
- repr()
- format()
- getattr()
- setattr()
- hasattr()
- delattr()
- dir()
- vars()
- globals()
- locals()
- eval()
- exec()
- compile()
- **import**()
- iter()
- next()
- help()
- breakpoint()
- object()
- property()
- staticmethod()
- classmethod()
- super()
- bytes()
- bytearray()
- memoryview()
- open()
- slice()

## str (String)

### Case Methods

- [ ] capitalize()
- [x] lower()
- [x] upper()
- [ ] title()

### Search Methods

- [ ] count()
- [ ] find()
- [ ] index()
- [ ] startswith()
- [ ] endswith()

### Modification Methods

- [ ] replace()
- [ ] strip()
- [ ] lstrip()
- [ ] rstrip()
- [ ] removeprefix()
- [ ] removesuffix()
- [ ] split()
- [ ] join()

### Validation Methods

- [ ] isalpha()
- [ ] isdigit()
- [ ] isnumeric()
- [ ] isspace()
- [ ] islower()
- [ ] isupper()

### Format Methods

- [ ] format()

### Not planned

- casefold()
- swapcase()
- rfind()
- rindex()
- rsplit()
- splitlines()
- center()
- ljust()
- rjust()
- zfill()
- expandtabs()
- isalnum()
- isascii()
- isdecimal()
- isidentifier()
- isprintable()
- istitle()
- encode()
- format_map()
- translate()
- maketrans()
- partition()
- rpartition()

## list (List)

### Mutating Methods

- [ ] append()
- [ ] extend()
- [ ] insert()
- [ ] remove()
- [ ] pop()
- [ ] clear()
- [ ] sort()
- [ ] reverse()

### Accessor Methods

- [ ] count()
- [x] index()
- [ ] copy()

## dict (Dictionary)

### Mutating Methods

- [ ] clear()
- [ ] pop()
- [ ] update()

### Accessor Methods

- [ ] get()
- [ ] items()
- [ ] keys()
- [ ] values()

### Not planned

- popitem()
- setdefault()
- copy()
- fromkeys()

## tuple (Tuple)

### Methods

- [ ] count()
- [ ] index()

## Not planned

### set (Set)

Sets are too advanced for a beginner-focused educational interpreter.

- add()
- clear()
- discard()
- pop()
- remove()
- update()
- difference_update()
- intersection_update()
- symmetric_difference_update()
- copy()
- difference()
- intersection()
- symmetric_difference()
- union()
- isdisjoint()
- issubset()
- issuperset()

### int (Integer)

Low-level binary and byte operations are too advanced.

- bit_length()
- to_bytes()
- from_bytes()

### float (Float)

Advanced float operations are too specialized.

- as_integer_ratio()
- is_integer()
- hex()
- fromhex()
