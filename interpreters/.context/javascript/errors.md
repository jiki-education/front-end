# JavaScript Error System Documentation

## Overview

JavaScript interpreter implements standardized error system with educational error messages for student learning.

## Error Architecture

### Error Types

**Error Categories:**

- **Syntax Errors**: Parsing, lexical, string termination, expression/statement syntax
- **Runtime Errors**: Binary/unary expressions, unsupported operations, variable access

Error classes include message, location, error type, and optional context for educational debugging.

## Translation System

Supports both educational and system messages with context interpolation for variables, lexemes, and expected elements.

## Error Naming Convention

Follows shared `[Prefix][Core][Context]` naming pattern with Missing, Invalid, Unexpected, Unterminated, Malformed prefixes.

## Implementation Details

**Scanner**: Unknown characters, unterminated strings/templates
**Parser**: Missing expressions/parentheses/semicolons, invalid declarations

Tests use system language for consistent error message verification.

Self-contained system using only shared location classes, with independent translation system.

## JavaScript Error Characteristics

Provides educational syntax and runtime errors with context interpolation for student-friendly debugging in JavaScript learning environments.

Provides specific error identification with contextual information and educational messaging, maintaining consistency with other Jiki interpreters while preserving architectural independence.
