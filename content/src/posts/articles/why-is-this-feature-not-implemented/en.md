---
title: "Why Is This Feature Not Implemented?"
excerpt: "Learn why certain language features are excluded from Jiki and how this helps you learn more effectively."
tags: ["reference", "javascript", "python", "learning"]
seo:
  description: "Understanding why Jiki excludes certain JavaScript and Python features to help beginners learn"
  keywords: ["jiki", "javascript", "python", "excluded features", "foot-guns", "learning"]
---

Tried to run your code and got a message saying something isn't available in this version of the language? Read on to understand what's going on!

If you got a message saying "This feature isn't available to you yet", that's a different situation - read **[When Will This Feature Unlock?](/articles/when-will-this-feature-unlock)** instead.

## Introduction

You've used a keyword or concept that our version of the language doesn't support. Don't worry - this isn't a bug!

The versions of JavaScript and Python you're using in Jiki have been **specifically designed by us** to help you learn. We've carefully removed certain features to stop you accidentally running into complex or confusing parts of the language before you're ready for them.

## Why exclude features?

Programming languages are designed for **professionals**. They contain advanced features that help experienced developers work faster, plus historical baggage - features that probably should have been removed years ago but stick around so that old systems keep working.

When you're learning, these features create confusion. By removing them, Jiki lets you focus on what matters: **learning to think like a programmer**.

### Foot-guns

We call some features **"foot-guns"** - things you can accidentally shoot yourself in the foot with. These are:

- **Genuinely problematic** and best avoided even by professionals
- **Confusing edge cases** that distract from the core concepts
- **Historical baggage** that exists only for backwards compatibility

These are permanently excluded from Jiki because they're just not worth the confusion they cause.

### Advanced features

Other features are excluded because they're **too advanced** for where you are in your learning journey. These aren't bad features - they're just not helpful when you're learning the fundamentals.

As you progress through Jiki, some of these features will unlock. But for now, focus on mastering the basics.

## The specifics

You don't need to read this unless you're actively interested in what's happening under the hood and the decisions we've made.

### JavaScript

| Feature                                                    | Why it's excluded                                                                                                |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `var`                                                      | Use `let` or `const` instead. `var` has confusing scoping rules that cause bugs even for experienced developers. |
| `with`                                                     | Deprecated and confusing. Creates ambiguous code that's hard to reason about.                                    |
| `debugger`                                                 | Development tool, not needed for learning.                                                                       |
| `void`                                                     | Rarely useful and confusing for beginners.                                                                       |
| `yield`                                                    | Advanced generator feature. You'll learn about generators later in your journey.                                 |
| `delete`                                                   | Can cause confusing behaviour with arrays and objects.                                                           |
| `import` / `export`                                        | Module system features. Jiki handles modules differently to keep things simple.                                  |
| Bitwise operators (`&`, `\|`, `^`, `~`, `<<`, `>>`, `>>>`) | Very rarely needed and confusing when you're learning. These are for low-level bit manipulation.                 |

### Python

| Feature    | Why it's excluded                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `global`   | Modifying global variables from inside functions leads to confusing code. Learn to pass values as parameters instead. |
| `nonlocal` | Advanced scoping feature for nested functions. Not needed when learning fundamentals.                                 |
| `assert`   | Debugging tool that can be disabled in production. Learn proper error handling instead.                               |

## What if I need a feature?

Each exercise in Jiki has been designed to be solved with the features you've been taught up to that point. If you're hitting a limitation, there's usually a better way to solve your problem using the features available. That's part of learning - figuring out how to work within constraints.

If you genuinely think a feature should be available at your level, let us know! We're always refining what's included based on feedback.
