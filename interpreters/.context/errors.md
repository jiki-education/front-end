# Error Handling Guide

This document provides comprehensive guidelines for implementing and managing errors across all Jiki interpreters (JikiScript, JavaScript, and Python).

## 🚨 CRITICAL: Error Translation Requirements

**WHENEVER YOU CREATE A NEW ERROR TYPE, YOU MUST:**

1. **Add the error type** to the appropriate error type definition in `src/[language]/error.ts`
2. **Create a system translation** in `src/[language]/locales/system/translation.json`
   - Format: `"ErrorName": "ErrorName: variable: {{variable}}"`
3. **Create an English translation** in `src/[language]/locales/en/translation.json`
   - Human-readable educational message for students

**Failure to add translations will cause runtime crashes when the error is thrown!**

## Error Naming Standard

### Design Principles

1. **Hyper-specific error names** - Each error should be uniquely identifiable and provide maximum context
2. **High granularity** - Prefer specific error types over generic ones
3. **Consistent i18n support** - Error names should map directly to translation keys
4. **Educational focus** - Error names should help students understand exactly what went wrong

### Naming Pattern

**Format: `[Prefix][Core][Context]`**

### Error Categories

All interpreters support these categories:

- **SyntaxError** - Parse-time issues with code structure
- **SemanticError** - Logic/meaning issues that are statically detectable
- **RuntimeError** - Execution-time issues
- **FeatureError** - Disabled language features (for progressive syntax)

### Prefixes by Category

**Error Prefix Reference:**

| Category     | Prefix                                                | Purpose                         |
| ------------ | ----------------------------------------------------- | ------------------------------- |
| **Syntax**   | Missing, Invalid, Unexpected, Unterminated, Malformed | Parse-time structure issues     |
| **Semantic** | Duplicate, Invalid                                    | Logic/meaning validation issues |
| **Runtime**  | NotFound, TypeError, RangeError, StateError           | Execution-time issues           |
| **Feature**  | Disabled                                              | Educational feature controls    |

## Translation File Rules

### System Translation

- Message exactly matches error name
- Variables: `"ErrorName: variable: {{variable}}"`

### English Translation

- Human-readable educational messages
- Use interpolated variables: `{{variable}}`

## Implementation Checklist

When creating a new error:

- [ ] Define error type in `src/[language]/error.ts`
- [ ] Add system translation to `src/[language]/locales/system/translation.json`
- [ ] Add English translation to `src/[language]/locales/en/translation.json`
- [ ] Keep error types alphabetically sorted within their category
- [ ] Add test coverage for the error case
- [ ] Pass context variables for dynamic information

## Migration Process

Update error type, references, translations, tests, and documentation.

## Testing Errors

Every error type requires test coverage using `expectFrameToBeError` helpers.

## Cross-Language Consistency

Use identical error names across all interpreters for consistent learning experience.

## Key Requirements

- Add both system and English translations
- Use specific error names with context variables
- Keep error types alphabetically sorted

## Quick Reference

See prefix reference table above for error naming guidelines.

Remember: **Every error needs translations, or the interpreter will crash!**
