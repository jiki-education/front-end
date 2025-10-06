# Shared Components Architecture

## Overview

Shared components unify common functionality between all interpreters (JikiScript, JavaScript, Python), ensuring consistent behavior and UI compatibility.

## Shared Components

### Frame System

Unified frame system that all interpreters use for educational visualization. Provides base frame interfaces, execution status tracking, and validation functions for consistent UI integration.

### JikiObject Base Class

Abstract base class for all object representations across interpreters. Provides unique object IDs, type system, and consistent interface that ensures cross-interpreter compatibility.

## Interpreter-Specific Extensions

Each interpreter extends the shared components with language-specific objects and frame descriptions while maintaining compatibility with the unified architecture.

## Architecture Benefits

### 1. **Unified UI Integration**

All interpreters generate the same frame format, enabling consistent timeline scrubbing, variable inspection, and educational visualization across languages.

### 2. **Code Reuse**

Common frame validation logic, shared object tracking system, and unified error handling patterns reduce duplication.

### 3. **Consistency**

Same educational experience across languages with standardized object lifecycle management and frame generation patterns.

### 4. **Extensibility**

Easy to add new interpreters with shared infrastructure that reduces implementation time and provides common testing utilities.

### 5. **Type Safety**

TypeScript ensures consistent interfaces with compile-time validation of frame structures and abstract base classes that enforce implementation contracts.
