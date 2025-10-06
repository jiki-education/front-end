# Python Error System Documentation

## Overview

Python interpreter implements standardized error system with educational error messages for Python-specific syntax and runtime errors.

## Error Architecture

### Error Types

**Error Categories:**

- **Syntax Errors**: Parsing, lexical, Python-specific indentation, string termination, expression syntax
- **Runtime Errors**: Variable scope, type operations, unsupported operations

Error classes include message, location, error type, and optional context for educational debugging.

## Translation System

Supports both educational and system messages with context interpolation for variables, lexemes, and token context.

## Error Naming Convention

Follows shared `[Prefix][Core][Context]` naming pattern with Python-specific additions like IndentationError and ParseError.

## Implementation Details

**Scanner**: Unknown characters, unterminated strings, Python lexical issues
**Parser**: Invalid syntax structures, missing elements, malformed statements
**Runtime**: Undefined variables, invalid operations, unsupported operations

Tests use system language for consistent error message verification with Python-specific error expectations.

Self-contained system using only shared location classes, with independent translation system.

## Python-Specific Error Characteristics

Provides Python-specific indentation error handling, detailed variable scope messages, and educational syntax/runtime errors tailored to Python conventions.

Provides Python-specific guidance with indentation awareness and runtime context, maintaining consistency with other Jiki interpreters while preserving Python-specific error handling characteristics.
