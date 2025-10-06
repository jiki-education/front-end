# JikiScript Evolution History

This document tracks the historical development and changes specific to the JikiScript interpreter.

## 2025-10-03: Removal of Executor Location Tracking

- **Removed**: `private location: Location` field from JikiScript executor
- **Change**: Error frames now use precise error locations (`error.location`) instead of broad statement locations
- **Implementation**:
  - Removed location tracking state from executor class
  - Removed location setting/resetting in `executeFrame()` wrapper
  - All error creation uses `error.location` for precise error reporting
  - Changed location parameters from `Location | null` to non-nullable `Location`
  - Introduced `Location.unknown` as fallback for unavailable locations
- **Benefits**:
  - Simpler executor state management
  - More precise error reporting pointing to exact sub-expressions
  - Clearer intent with explicit location handling
  - Reduced complexity in error handling code
- **Impact**: Updated approximately 20+ error creation sites across JikiScript executor modules
- **Pattern Leadership**: This change was applied to JikiScript first, then replicated to JavaScript and Python interpreters for consistency

## Object System Evolution

### January 2025: File Reorganization and Standardization

- **File Rename**: `jikiObjects.ts` → `objects.ts` as part of cross-interpreter standardization
- **Cross-Interpreter Compatibility**: Uses same base class as JavaScript and Python interpreters
- **JikiScript-Specific Features**: Maintained `toArg()` method and educational features during standardization
- **Reference Pattern**: JikiScript served as the original pattern that other interpreters adopted
- **Rationale**: The standardization ensured all interpreters follow the same object field naming conventions

### Original Architecture (Foundation)

JikiScript established the foundational patterns that other interpreters later adopted:

- First to implement standardized `jikiObject` field in `EvaluationResult`
- Established the `JikiObject` base class pattern that became shared across all interpreters
- Created the object field naming standard that eliminated the need for language-specific duplicates

## Error System Development

### Comprehensive Error Implementation

JikiScript implemented the most comprehensive error system across all interpreters:

**Error Type Coverage**:

- 108+ Syntax Errors covering all lexical and parsing scenarios
- 58+ Runtime Errors for execution-time issues
- 12+ Semantic Errors for logical validation
- Feature Errors for educational progression

**Historical Test Coverage**:

- 178+ total error types with full test coverage
- 96+ runtime error test cases with frame validation
- Complete system language integration for consistent testing

**Translation System Evolution**:

- Established the definitive system/en translation pattern
- Created the most granular error interpolation system
- Implemented comprehensive educational messaging

## Architectural Milestones

### Foundation Implementation

JikiScript served as the reference implementation:

- Established the modular executor pattern with individual executors per AST node type
- Created the educational frame description system
- Implemented progressive language feature controls
- Established the shared component contribution pattern

### Shared Component Contributions

JikiScript provided the foundational interfaces that became shared:

- `JikiObject` base class design
- Frame structure definition
- Error handling patterns
- Educational description frameworks

## Implementation Standards

### Error Naming Convention Establishment

JikiScript defined the error naming standards adopted by all interpreters:

1. **Naming Pattern**: `[Prefix][Core][Context]` structure
2. **Granularity Principle**: Error names match English message specificity
3. **Educational Focus**: Messages prioritize student understanding
4. **Consistency Requirement**: Alphabetical organization across all files

### Testing Pattern Creation

JikiScript established testing patterns used by all interpreters:

- System language configuration for error message consistency
- Frame-based error validation
- Comprehensive coverage requirements
- Educational test message verification

## Educational Features Evolution

### Progressive Syntax Implementation

JikiScript pioneered the educational language feature system:

- Configurable syntax inclusion/exclusion
- Educational error messaging for disabled features
- Gradual complexity introduction for learning

### Frame Description System

JikiScript created the descriptive execution system:

- Human-readable explanations for each operation
- Step-by-step breakdown of complex expressions
- Educational context for error scenarios

## Historical Context

### Why JikiScript Led Development

- **Educational Focus**: Designed specifically for learning programming concepts
- **Complete Implementation**: Full language feature set with educational enhancements
- **Reference Architecture**: Established patterns followed by other interpreters

### Contributions to Shared Architecture

- **Base Classes**: Provided `JikiObject` and frame interfaces
- **Error Standards**: Defined error naming and handling conventions
- **Educational Patterns**: Created description and progression frameworks
- **Testing Standards**: Established validation and error checking patterns

### Current Status

JikiScript remains the most comprehensive interpreter with:

- Most detailed error identification system
- Complete educational feature implementation
- Reference standard for cross-interpreter consistency
- Foundation architecture that ensures UI compatibility

This evolution history shows JikiScript as the foundational interpreter that established the architectural and educational standards followed by the entire Jiki ecosystem.
