# JavaScript Standard Library Reference

This document lists all standard library methods for the JavaScript interpreter. Methods are organized by the object/type they act on. Use checkboxes to track implementation status.

## Globals (console)

- [x] console.log()

### Not planned

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

## Globals (Functions)

- [ ] isFinite()
- [ ] isNaN()
- [ ] parseFloat()
- [ ] parseInt()
- [ ] encodeURI()
- [ ] encodeURIComponent()

### Not planned

- eval()
- decodeURI()
- decodeURIComponent()

## Array

### Properties

- [x] length

### Static Methods

- [ ] Array.from()
- [ ] Array.isArray()

### Not planned

- Array.of()

### Instance Methods - Mutating

- [x] push()
- [x] pop()
- [x] shift()
- [x] unshift()
- [ ] splice()
- [ ] sort()
- [ ] reverse()
- [ ] fill()

### Instance Methods - Accessor

- [x] at()
- [x] concat()
- [x] slice()
- [x] indexOf()
- [ ] lastIndexOf()
- [x] includes()
- [x] join()
- [ ] toString()
- [ ] entries()
- [ ] keys()
- [ ] values()

### Not planned

- copyWithin()
- toLocaleString()

### Instance Methods - Iteration

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

## String

### Properties

- [x] length

### Instance Methods - Case

- [x] toLowerCase()
- [x] toUpperCase()

### Not planned

- toLocaleLowerCase()
- toLocaleUpperCase()

### Instance Methods - Search

- [ ] indexOf()
- [ ] lastIndexOf()
- [ ] search()
- [ ] includes()
- [ ] startsWith()
- [ ] endsWith()
- [ ] match()
- [ ] matchAll()

### Instance Methods - Extraction

- [ ] at()
- [ ] charAt()
- [ ] slice()
- [ ] substring()

### Instance Methods - Modification

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

### Instance Methods - Other

- [ ] toString()
- [ ] valueOf()

### Not planned

- charCodeAt()
- codePointAt()
- substr()
- normalize()
- localeCompare()
- isWellFormed()
- toWellFormed()

## Number

### Static Properties

- [ ] Number.MAX_SAFE_INTEGER
- [ ] Number.MIN_SAFE_INTEGER
- [ ] Number.MAX_VALUE
- [ ] Number.MIN_VALUE
- [ ] Number.NaN
- [ ] Number.NEGATIVE_INFINITY
- [ ] Number.POSITIVE_INFINITY

### Static Methods

- [ ] Number.isFinite()
- [ ] Number.isInteger()
- [ ] Number.isNaN()
- [ ] Number.parseFloat()
- [ ] Number.parseInt()

### Instance Methods

- [ ] toFixed()
- [ ] toString()
- [ ] valueOf()

### Not planned

- Number.EPSILON
- Number.isSafeInteger()
- toExponential()
- toPrecision()
- toLocaleString()

## Math

### Properties

- [ ] Math.E
- [ ] Math.LN2
- [ ] Math.LN10
- [ ] Math.LOG2E
- [ ] Math.LOG10E
- [ ] Math.PI
- [ ] Math.SQRT1_2
- [ ] Math.SQRT2

### Static Methods - Basic

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

### Static Methods - Trigonometric

- [ ] Math.sin()
- [ ] Math.cos()
- [ ] Math.tan()
- [ ] Math.asin()
- [ ] Math.acos()
- [ ] Math.atan()
- [ ] Math.atan2()

### Static Methods - Logarithmic & Exponential

- [ ] Math.exp()
- [ ] Math.log()
- [ ] Math.log10()
- [ ] Math.log2()

### Not planned

- Math.sinh()
- Math.cosh()
- Math.tanh()
- Math.asinh()
- Math.acosh()
- Math.atanh()
- Math.expm1()
- Math.log1p()
- Math.clz32()
- Math.fround()
- Math.f16round()

## Object

### Static Methods

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

## JSON

### Static Methods

- [ ] JSON.parse()
- [ ] JSON.stringify()

## Date

### Static Methods

- [ ] Date.now()

### Instance Methods - Getters

- [ ] getDate()
- [ ] getDay()
- [ ] getFullYear()
- [ ] getHours()
- [ ] getMinutes()
- [ ] getMonth()
- [ ] getSeconds()

### Instance Methods - String Output

- [ ] toString()
- [ ] toDateString()
- [ ] toTimeString()
- [ ] toISOString()
- [ ] toUTCString()
- [ ] toJSON()

### Not planned

- Date.parse()
- Date.UTC()
- getTime()
- getMilliseconds()
- getTimezoneOffset()
- setDate()
- setFullYear()
- setHours()
- setMilliseconds()
- setMinutes()
- setMonth()
- setSeconds()
- setTime()
- toLocaleDateString()
- toLocaleString()
- toLocaleTimeString()
- valueOf()

## Promise

### Static Methods

- [ ] Promise.all()
- [ ] Promise.allSettled()
- [ ] Promise.any()
- [ ] Promise.race()
- [ ] Promise.reject()
- [ ] Promise.resolve()

### Instance Methods

- [ ] then()
- [ ] catch()
- [ ] finally()
