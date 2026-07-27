---
title: "Type Conversion"
description: "Turning a value of one type into another, like converting a string of digits into a number with `Number()`, or a number into a string with `String()`."
---

Every value in our programs has a type. `"7"` is a string and `7` is a number. They might look almost identical, but Jiki treats them very differently. You can't add the string `"7"` to the number `3` and expect to get `10`, because one of them is a piece of text and the other is a quantity.

Quite often we need to move a value from one type to another. This is called <define>type conversion</define>, and there are two conversions you'll reach for all the time.

### Turning a string into a number

When you read characters out of a string, each character is itself a string, even when it looks like a digit. Before you can do any arithmetic with it, you need to turn it into a real number. We do that with `Number()`.

```javascript
Number("7")
// 7

Number("42")
// 42
```

Once you have an actual number, you can add it, multiply it, and everything else.

```javascript
let digit = Number("7")
let doubled = digit * 2
// 14
```

If you hand `Number()` something that isn't a valid number, like `Number("cat")`, you won't get a number back at all, so it's worth making sure you only give it strings that really are digits.

### Turning a number into a string

The opposite direction is just as handy. Sometimes you have a number and you want to treat it as text, maybe to join it onto another string or to look at its individual digits. We do that with `String()`, the mirror image of `Number()`.

```javascript
String(42)
// "42"

let count = 7
String(count)
// "7"
```

Now that it's a string, you can use all the usual string tools on it, like reading it character by character or checking its length.
