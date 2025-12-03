---
title: "Understanding Jiki's JavaScript: Sensible Mode vs Parity Mode"
excerpt: "Learn about Jiki's two JavaScript modes - Sensible Mode for beginners and Parity Mode for real-world JavaScript - and how they help you learn effectively."
tags: ["javascript", "learning", "modes", "reference"]
seo:
  description: "Complete guide to Jiki's JavaScript Sensible Mode and Parity Mode for effective learning"
  keywords: ["jiki javascript", "sensible mode", "parity mode", "learn javascript", "javascript for beginners"]
---

# Understanding Jiki's JavaScript Modes

When you learn JavaScript with Jiki, you'll encounter two distinct modes: **Sensible Mode** and **Parity Mode**. Understanding these modes will help you get the most out of your learning experience.

## What is Sensible Mode?

Sensible Mode is Jiki's beginner-friendly version of JavaScript. It's designed to help you learn programming concepts without getting distracted by JavaScript's quirks and historical baggage.

### Key Features of Sensible Mode

**1. Strict Variable Declarations**

In Sensible Mode, you _must_ declare variables before using them:

```javascript
// ✅ This works
let x = 5;
console.log(x);

// ❌ This gives a clear error
console.log(y); // Error: Variable 'y' has not been declared
```

**2. No Variable Shadowing**

You can't accidentally reuse variable names from outer scopes:

```javascript
let name = "Alice";

if (true) {
  let name = "Bob"; // ❌ Error: Variable 'name' is already declared
}
```

This prevents confusing bugs where you think you're using one variable but you're actually using another.

**3. Boolean-Only Conditions**

Conditions must be actual booleans, not "truthy" or "falsy" values:

```javascript
// ✅ This works
if (x > 5) {
  // ...
}

// ❌ This gives an error
if (x) {
  // Error: Only boolean values allowed in conditions
  // ...
}
```

**4. Const Must Be Initialized**

Constants must have a value when declared:

```javascript
// ✅ This works
const pi = 3.14159;

// ❌ This gives an error
const x; // Error: Constants must be initialized when declared
```

**5. Clear Error Messages**

Errors in Sensible Mode are designed to be educational:

```
Error: Variable 'count' has not been declared.
Did you forget to use 'let' or 'const'?
```

### Why Sensible Mode?

JavaScript was created in 10 days back in 1995, and it has some behaviors that can confuse beginners:

- Variables can be used before they're declared (hoisting)
- Almost any value can be used as a condition ("truthiness")
- Silent type coercion can lead to unexpected results

Sensible Mode removes these foot-guns so you can focus on learning the core concepts of programming.

## What is Parity Mode?

Parity Mode is real JavaScript - the same language that runs in billions of web browsers worldwide. Once you've mastered the basics in Sensible Mode, Parity Mode lets you learn how JavaScript actually works.

### Key Features of Parity Mode

**1. Truthiness and Falsiness**

In Parity Mode, many values can be used in conditions:

```javascript
if (userName) {
  // Works if userName is any non-empty string
  console.log("Hello, " + userName);
}

if (items.length) {
  // Works if array has items
  console.log("You have items!");
}
```

**2. Variable Shadowing Allowed**

You can reuse variable names in inner scopes:

```javascript
let name = "Alice";

function greet() {
  let name = "Bob"; // Different variable with same name
  console.log("Hello, " + name); // Prints "Bob"
}

console.log(name); // Prints "Alice"
```

**3. More Flexibility**

Parity Mode allows patterns that experienced developers use but might confuse beginners:

- Optional semicolons
- Implicit type conversion
- Variable hoisting
- And more!

### Why Parity Mode?

Once you understand the fundamentals, you need to learn how JavaScript actually works in the real world. Parity Mode teaches you:

- How to work with existing JavaScript code
- Common JavaScript idioms and patterns
- What to watch out for in production code

## When to Use Each Mode

### Start with Sensible Mode

If you're:

- New to programming
- Learning your first language
- Focused on understanding core concepts

**Use Sensible Mode** to build a solid foundation without distractions.

### Progress to Parity Mode

Once you've:

- Mastered variables, functions, and control flow
- Built several projects in Sensible Mode
- Feel confident with basic programming concepts

**Switch to Parity Mode** to learn real-world JavaScript.

## Switching Between Modes

You can switch between modes at any time in Jiki:

1. Go to your Settings
2. Find the "JavaScript Mode" option
3. Choose "Sensible" or "Parity"
4. Your exercises will update automatically

**Note**: Some advanced exercises require Parity Mode.

## Common Questions

### Q: Is Sensible Mode "real" JavaScript?

Sort of! Sensible Mode is still JavaScript, but with extra guardrails. Think of it like training wheels on a bicycle - they're there to help you learn, but eventually you'll ride without them.

### Q: Will I need to "unlearn" things from Sensible Mode?

No! Everything you learn in Sensible Mode applies to Parity Mode. Parity Mode just allows _additional_ patterns that Sensible Mode restricts.

### Q: Can I use Sensible Mode code in production?

Not directly. Sensible Mode is a learning tool. But the code you write will easily translate to standard JavaScript once you understand the concepts.

### Q: How long should I stay in Sensible Mode?

It varies! Some learners switch after a few weeks, others after a few months. Switch when you feel confident with the basics and want to learn JavaScript's full feature set.

### Q: Do professional developers use Sensible Mode?

No - Sensible Mode is specifically designed for learning. Professional developers use tools like TypeScript and ESLint to catch similar issues in real code.

## Best Practices

### In Sensible Mode

- **Focus on concepts**: Don't worry about JavaScript quirks yet
- **Build projects**: Apply what you learn in real exercises
- **Read error messages**: They're designed to teach you

### In Parity Mode

- **Learn the "why"**: Understand _why_ JavaScript works the way it does
- **Read real code**: Look at open-source JavaScript projects
- **Use developer tools**: Learn to debug in browser consoles

## Summary

- **Sensible Mode**: Beginner-friendly JavaScript with guardrails
- **Parity Mode**: Real JavaScript as used in production
- **Start with Sensible**: Build foundations without distraction
- **Progress to Parity**: Learn real-world JavaScript when ready
- **Switch anytime**: You control your learning path

Both modes are valuable tools in your JavaScript learning journey. Use them wisely, and you'll become a confident JavaScript developer!

---

_Have questions? Reach out to us at [hello@jiki.io](mailto:hello@jiki.io)_
