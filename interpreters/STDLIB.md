# Standard Library Reference

This document lists all standard library methods for JavaScript and Python interpreters. Methods are organized by the object/type they act on. Use checkboxes to track implementation status.

## JavaScript

### Globals (console)

- [x] console.log()

#### Not planned

- console.error()
- console.warn()
- console.info()
- console.debug()
- console.table()
- console.time()
- console.timeEnd()
- console.clear()
- console.count()
- console.trace()
- console.assert()

### Globals (Functions)

- [ ] isFinite()
- [ ] isNaN()
- [ ] parseFloat()
- [ ] parseInt()
- [ ] encodeURI()
- [ ] encodeURIComponent()

#### Not planned

- eval()
- decodeURI()
- decodeURIComponent()

### Array

#### Properties

- [x] length

#### Static Methods

- [ ] Array.from()
- [ ] Array.isArray()
- [ ] Array.of()

#### Instance Methods - Mutating

- [x] push()
- [x] pop()
- [x] shift()
- [x] unshift()
- [ ] splice()
- [ ] sort()
- [ ] reverse()
- [ ] fill()
- [ ] copyWithin()

#### Instance Methods - Accessor

- [x] at()
- [x] concat()
- [x] slice()
- [x] indexOf()
- [ ] lastIndexOf()
- [x] includes()
- [x] join()
- [ ] toString()
- [ ] toLocaleString()
- [ ] entries()
- [ ] keys()
- [ ] values()

#### Instance Methods - Iteration

- [ ] forEach()
- [ ] map()
- [ ] filter()
- [ ] reduce()
- [ ] reduceRight()
- [ ] find()
- [ ] findIndex()
- [ ] findLast()
- [ ] findLastIndex()
- [ ] every()
- [ ] some()
- [ ] flat()
- [ ] flatMap()
- [ ] toReversed()
- [ ] toSorted()
- [ ] toSpliced()
- [ ] with()

### String

#### Properties

- [x] length

#### Instance Methods - Case

- [x] toLowerCase()
- [x] toUpperCase()

#### Not planned

- toLocaleLowerCase()
- toLocaleUpperCase()

#### Instance Methods - Search

- [ ] indexOf()
- [ ] lastIndexOf()
- [ ] search()
- [ ] includes()
- [ ] startsWith()
- [ ] endsWith()
- [ ] match()
- [ ] matchAll()

#### Instance Methods - Extraction

- [ ] at()
- [ ] charAt()
- [ ] charCodeAt()
- [ ] codePointAt()
- [ ] slice()
- [ ] substring()
- [ ] substr()

#### Instance Methods - Modification

- [ ] concat()
- [ ] repeat()
- [ ] replace()
- [ ] replaceAll()
- [ ] split()
- [ ] trim()
- [ ] trimStart()
- [ ] trimEnd()
- [ ] padStart()
- [ ] padEnd()

#### Instance Methods - Other

- [ ] normalize()
- [ ] toString()
- [ ] valueOf()

#### Not planned

- [ ] localeCompare()
- [ ] isWellFormed()
- [ ] toWellFormed()

### Number

#### Static Properties

- [ ] Number.EPSILON
- [ ] Number.MAX_SAFE_INTEGER
- [ ] Number.MIN_SAFE_INTEGER
- [ ] Number.MAX_VALUE
- [ ] Number.MIN_VALUE
- [ ] Number.NaN
- [ ] Number.NEGATIVE_INFINITY
- [ ] Number.POSITIVE_INFINITY

#### Static Methods

- [ ] Number.isFinite()
- [ ] Number.isInteger()
- [ ] Number.isNaN()
- [ ] Number.isSafeInteger()
- [ ] Number.parseFloat()
- [ ] Number.parseInt()

#### Instance Methods

- [ ] toExponential()
- [ ] toFixed()
- [ ] toLocaleString()
- [ ] toPrecision()
- [ ] toString()
- [ ] valueOf()

### Math

#### Properties

- [ ] Math.E
- [ ] Math.LN2
- [ ] Math.LN10
- [ ] Math.LOG2E
- [ ] Math.LOG10E
- [ ] Math.PI
- [ ] Math.SQRT1_2
- [ ] Math.SQRT2

#### Static Methods - Basic

- [ ] Math.abs()
- [ ] Math.ceil()
- [ ] Math.floor()
- [ ] Math.round()
- [ ] Math.trunc()
- [ ] Math.sign()
- [ ] Math.max()
- [ ] Math.min()
- [ ] Math.pow()
- [ ] Math.sqrt()
- [ ] Math.cbrt()
- [ ] Math.random()

#### Static Methods - Trigonometric

- [ ] Math.sin()
- [ ] Math.cos()
- [ ] Math.tan()
- [ ] Math.asin()
- [ ] Math.acos()
- [ ] Math.atan()
- [ ] Math.atan2()
- [ ] Math.sinh()
- [ ] Math.cosh()
- [ ] Math.tanh()
- [ ] Math.asinh()
- [ ] Math.acosh()
- [ ] Math.atanh()

#### Static Methods - Logarithmic & Exponential

- [ ] Math.exp()
- [ ] Math.expm1()
- [ ] Math.log()
- [ ] Math.log10()
- [ ] Math.log1p()
- [ ] Math.log2()

#### Static Methods - Other

- [ ] Math.clz32()
- [ ] Math.fround()
- [ ] Math.f16round()

### Object

#### Static Methods

- [ ] Object.assign()
- [ ] Object.create()
- [ ] Object.defineProperty()
- [ ] Object.defineProperties()
- [ ] Object.entries()
- [ ] Object.freeze()
- [ ] Object.fromEntries()
- [ ] Object.getOwnPropertyDescriptor()
- [ ] Object.getOwnPropertyDescriptors()
- [ ] Object.getOwnPropertyNames()
- [ ] Object.getOwnPropertySymbols()
- [ ] Object.getPrototypeOf()
- [ ] Object.hasOwn()
- [ ] Object.is()
- [ ] Object.isExtensible()
- [ ] Object.isFrozen()
- [ ] Object.isSealed()
- [ ] Object.keys()
- [ ] Object.preventExtensions()
- [ ] Object.seal()
- [ ] Object.setPrototypeOf()
- [ ] Object.values()

### JSON

#### Static Methods

- [ ] JSON.parse()
- [ ] JSON.stringify()

### Date

#### Static Methods

- [ ] Date.now()
- [ ] Date.parse()
- [ ] Date.UTC()

#### Instance Methods

- [ ] getDate()
- [ ] getDay()
- [ ] getFullYear()
- [ ] getHours()
- [ ] getMilliseconds()
- [ ] getMinutes()
- [ ] getMonth()
- [ ] getSeconds()
- [ ] getTime()
- [ ] getTimezoneOffset()
- [ ] setDate()
- [ ] setFullYear()
- [ ] setHours()
- [ ] setMilliseconds()
- [ ] setMinutes()
- [ ] setMonth()
- [ ] setSeconds()
- [ ] setTime()
- [ ] toDateString()
- [ ] toISOString()
- [ ] toJSON()
- [ ] toLocaleDateString()
- [ ] toLocaleString()
- [ ] toLocaleTimeString()
- [ ] toString()
- [ ] toTimeString()
- [ ] toUTCString()
- [ ] valueOf()

### Promise

#### Static Methods

- [ ] Promise.all()
- [ ] Promise.allSettled()
- [ ] Promise.any()
- [ ] Promise.race()
- [ ] Promise.reject()
- [ ] Promise.resolve()

#### Instance Methods

- [ ] then()
- [ ] catch()
- [ ] finally()

## Python

### Globals (Built-in Functions)

#### Type Conversion

- [x] print()
- [ ] input()
- [ ] int()
- [ ] float()
- [ ] str()
- [ ] bool()
- [ ] list()
- [ ] tuple()
- [ ] dict()
- [ ] set()
- [ ] frozenset()
- [ ] complex()

#### Numeric Functions

- [ ] abs()
- [ ] round()
- [ ] pow()
- [ ] min()
- [ ] max()
- [ ] sum()
- [ ] divmod()

#### Sequence & Iteration Functions

- [ ] len()
- [ ] range()
- [ ] sorted()
- [ ] reversed()
- [ ] enumerate()
- [ ] zip()
- [ ] filter()
- [ ] map()

#### Logic Functions

- [ ] all()
- [ ] any()

#### Object & Type Functions

- [ ] type()
- [ ] isinstance()
- [ ] issubclass()
- [ ] callable()
- [ ] id()
- [ ] hash()

#### String Functions

- [ ] chr()
- [ ] ord()
- [ ] bin()
- [ ] hex()
- [ ] oct()
- [ ] ascii()
- [ ] repr()
- [ ] format()

#### Attribute Functions

- [ ] getattr()
- [ ] setattr()
- [ ] hasattr()
- [ ] delattr()
- [ ] dir()
- [ ] vars()
- [ ] globals()
- [ ] locals()

#### Advanced Functions

- [ ] eval()
- [ ] exec()
- [ ] compile()
- [ ] **import**()
- [ ] iter()
- [ ] next()
- [ ] help()
- [ ] breakpoint()

#### Object Construction

- [ ] object()
- [ ] property()
- [ ] staticmethod()
- [ ] classmethod()
- [ ] super()

#### Byte Functions

- [ ] bytes()
- [ ] bytearray()
- [ ] memoryview()

#### IO Functions

- [ ] open()

#### Other Functions

- [ ] slice()

### str (String)

#### Case Methods

- [ ] capitalize()
- [ ] casefold()
- [x] lower()
- [x] upper()
- [ ] swapcase()
- [ ] title()

#### Search Methods

- [ ] count()
- [ ] find()
- [ ] rfind()
- [ ] index()
- [ ] rindex()
- [ ] startswith()
- [ ] endswith()

#### Modification Methods

- [ ] replace()
- [ ] strip()
- [ ] lstrip()
- [ ] rstrip()
- [ ] removeprefix()
- [ ] removesuffix()
- [ ] split()
- [ ] rsplit()
- [ ] splitlines()
- [ ] join()
- [ ] center()
- [ ] ljust()
- [ ] rjust()
- [ ] zfill()
- [ ] expandtabs()

#### Validation Methods

- [ ] isalnum()
- [ ] isalpha()
- [ ] isascii()
- [ ] isdecimal()
- [ ] isdigit()
- [ ] isidentifier()
- [ ] islower()
- [ ] isnumeric()
- [ ] isprintable()
- [ ] isspace()
- [ ] istitle()
- [ ] isupper()

#### Encoding Methods

- [ ] encode()

#### Format Methods

- [ ] format()
- [ ] format_map()

#### Other Methods

- [ ] translate()
- [ ] maketrans()
- [ ] partition()
- [ ] rpartition()

### list (List)

#### Mutating Methods

- [ ] append()
- [ ] extend()
- [ ] insert()
- [ ] remove()
- [ ] pop()
- [ ] clear()
- [ ] sort()
- [ ] reverse()

#### Accessor Methods

- [ ] count()
- [x] index()
- [ ] copy()

### dict (Dictionary)

#### Mutating Methods

- [ ] clear()
- [ ] pop()
- [ ] popitem()
- [ ] setdefault()
- [ ] update()

#### Accessor Methods

- [ ] copy()
- [ ] get()
- [ ] items()
- [ ] keys()
- [ ] values()

#### Static Methods

- [ ] fromkeys()

### set (Set)

#### Mutating Methods

- [ ] add()
- [ ] clear()
- [ ] discard()
- [ ] pop()
- [ ] remove()
- [ ] update()
- [ ] difference_update()
- [ ] intersection_update()
- [ ] symmetric_difference_update()

#### Accessor Methods

- [ ] copy()
- [ ] difference()
- [ ] intersection()
- [ ] symmetric_difference()
- [ ] union()
- [ ] isdisjoint()
- [ ] issubset()
- [ ] issuperset()

### tuple (Tuple)

#### Methods

- [ ] count()
- [ ] index()

### int (Integer)

#### Methods

- [ ] bit_length()
- [ ] to_bytes()
- [ ] from_bytes()

### float (Float)

#### Methods

- [ ] as_integer_ratio()
- [ ] is_integer()
- [ ] hex()
- [ ] fromhex()
