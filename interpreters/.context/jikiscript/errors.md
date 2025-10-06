# JikiScript Error System Documentation

## Overview

JikiScript implements the foundational error system with hyper-specific, educational error messages.

## Error Architecture

### Error Types

JikiScript defines **SyntaxError**, **SemanticError**, **RuntimeError**, and **FeatureError** to provide comprehensive coverage:

**Error Categories:**

- **Syntax Errors**: Lexical, parsing, termination, declaration syntax
- **Semantic Errors**: Scope validation, type compatibility, semantic analysis
- **Runtime Errors**: Variable access, function calls, object instantiation, control flow
- **Feature Errors**: Disabled language features and educational progression controls

### Error Classes

All error types include message, location, error type, and optional context for educational debugging.

## Translation System

### Structure

Supports both educational messages for students and system messages for error handling across all error categories.

### Message Format

System translations support simple errors, contextual errors with variables, and complex multi-parameter errors with comprehensive interpolation.

## Error Naming Convention

Follows shared `[Prefix][Core][Context]` naming pattern with comprehensive prefixes and alphabetical organization. Most detailed error naming across all interpreters.

## Implementation Details

### Error Detection

**Scanner**: Character-level lexical error detection with termination tracking
**Parser**: Comprehensive syntax validation and structure checking
**Semantic**: Scope validation, type compatibility, and control flow analysis
**Runtime**: Variable access monitoring, function validation, and state management

## Educational Features

### Educational Features

Progressive error disclosure through feature-specific controls, granular syntax enabling, and enhanced context with multi-variable interpolation and suggested fixes.

## Testing Integration

Comprehensive test suites with system language verification and frame-based execution testing.

## Architecture Role

Foundational interpreter providing base interfaces to shared components and defining standards for other interpreters.

## JikiScript Error Uniqueness

Most comprehensive error system with detailed context variables, progressive error disclosure, and educational messaging specifically designed for programming education.

## Educational Impact

Provides comprehensive error coverage with student-friendly messaging, progressive disclosure for curriculum progression, and frame-integrated error visualization. Serves as the reference implementation for all interpreter error handling.
