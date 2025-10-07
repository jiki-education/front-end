# Context Documentation Audit and Update Plan

## Overview

This document outlines the comprehensive audit findings for the .context documentation files and provides an implementation plan for necessary updates.

## Audit Summary

### Current State

- 17 context documentation files reviewed
- Multiple factual inaccuracies found
- Missing critical documentation for interpreters integration
- Some outdated information that needs cleanup
- Good overall structure but needs refinement

## Implementation Plan

### Priority 1: Critical Factual Fixes

#### 1.1 Fix `.context/architecture.md`

**Issues:**

- States there's a `/lib` directory at root (doesn't exist)
- Missing mention of `/utils` directory that does exist
- Incorrect project structure diagram

**Actions:**

- Remove reference to `/lib` directory
- Add `/utils` directory to project structure
- Update directory organization section to match actual structure

#### 1.2 Fix `.context/testing.md`

**Issues:**

- References obsolete GitHub workflow structure
- Ubuntu package names for CI are outdated

**Actions:**

- Update to reflect actual workflows: formatting.yml, unit-tests.yml, e2e-tests.yml, typecheck.yml
- Update CI package names for Ubuntu compatibility

#### 1.3 Fix `.context/tech-stack.md`

**Issues:**

- Lists incorrect Next.js version
- Missing key dependencies

**Actions:**

- Update Next.js version to match package.json
- Add missing dependencies: interpreters (workspace), lodash, diff, marked, animejs

#### 1.4 Fix `.context/coding-exercise/README.md`

**Issues:**

- File structure diagram shows incorrect paths
- Missing TestSuiteManager from orchestrator components

**Actions:**

- Correct file paths in structure diagram
- Add TestSuiteManager to orchestrator internal managers list

### Priority 2: Add Missing Documentation

#### 2.1 Create `.context/coding-exercise/interpreters.md`

**Content to include:**

- How interpreters integrate with complex exercise
- Frame generation and TIME_SCALE_FACTOR
- JikiScript vs JavaScript execution differences
- Key types (Frame, FrameExecutionStatus)
- Reference to interpreters workspace package

### Priority 3: Enhance Existing Documentation

#### 3.1 Enhance `.context/coding-exercise/time-scales.md`

**Actions:**

- Add reference to interpreters package location
- Clarify that TIME_SCALE_FACTOR is imported from interpreters/src/shared/frames.ts
- Update Frame interface to match actual implementation

#### 3.2 Update `.context/coding-exercise/test-runner.md`

**Actions:**

- Add TestSuiteManager details and its role
- Clarify interpreter integration points
- Update test result structure documentation

### Priority 4: Cleanup and Maintenance

#### 4.1 Clean `.context/deployment.md`

**Actions:**

- Remove completed checklist items
- Add more specific deployment details if available
- Update with current deployment status

#### 4.2 Update `.context/commands.md`

**Actions:**

- Add missing scripts: format, format:check, prepare
- Verify Turbopack note is still accurate
- Ensure all package.json scripts are documented

#### 4.3 Minor Updates to `.context/git.md`

**Actions:**

- Add typecheck workflow mention
- Ensure all workflows are documented

### Priority 5: Documentation Organization

#### 5.1 Add Cross-References

**Actions:**

- Ensure all coding-exercise files link back to main README
- Add "See also" sections to related files
- Improve navigation between related concepts

## Key Insights from Interpreters Package

### Interpreters Role

The interpreters workspace package provides:

1. **Multiple language interpreters** (JikiScript, JavaScript, Python)
2. **Frame generation system** with microsecond timing
3. **TIME_SCALE_FACTOR (1000)** for microsecond to millisecond conversion
4. **Shared components** including Frame interface and JikiObject base class
5. **Educational features** like progressive syntax and friendly errors

### Integration Points

- Interpreters generate frames during code execution
- Frames power the scrubber timeline in complex exercise
- AnimationTimeline uses frame timing for synchronization
- Test runner uses interpreters to execute student code

## Notes

### CLAUDE.md Symlink

The CLAUDE.md -> AGENTS.md symlink is intentional and working correctly. It ensures AI assistants can find instructions under either filename. No action needed.

### Documentation Philosophy

- Document current state, not history
- Avoid code duplication - reference files instead
- Keep instructional examples that explain concepts
- Update immediately when patterns change

## Execution Order

1. Create this CONTEXT_PLAN.md ✓
2. Fix critical factual errors (Priority 1)
3. Add missing documentation (Priority 2)
4. Enhance existing files (Priority 3)
5. Cleanup outdated content (Priority 4)
6. Add cross-references (Priority 5)

## Success Criteria

- All factual errors corrected
- No missing critical documentation
- Clear navigation between related files
- Accurate representation of current codebase
- No outdated or misleading information

## Timeline

Estimated completion: All updates can be completed in a single session, working through priorities sequentially.
