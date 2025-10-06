# Context Documentation Guidelines

This document outlines the standards for maintaining the .context/ documentation system that guides LLM development on the Jiki interpreter project.

## Evolution Tracking System

### Purpose

All historical information, point-in-time details, and major changes must be preserved in dedicated evolution documents to prevent context size explosion while maintaining complete project history.

### Structure

- **Central Evolution**: `.context/evolution.md` - Cross-interpreter changes and major milestones
- **Interpreter-Specific**: `.context/[interpreter]/evolution.md` - Language-specific historical development

### What Goes in Evolution Documents

- Architecture alignment details (e.g., "January 2025 refactoring")
- Object field standardization changes (e.g., `jsObject` → `jikiObject`)
- Test count specifics and implementation status milestones
- Commit history and migration processes
- Before/after architectural comparisons
- Implementation timeline and decision rationale

### What Stays in Architecture Documents

- Current state architectural patterns
- Essential interfaces and structures
- Critical rules for UI compatibility
- Mandatory patterns that must be followed
- Concise implementation guidance

## Documentation Compression Standards

### Target: 60-70% size reduction while preserving all information

### Compression Strategies

1. **Remove Code Examples**: Replace with brief descriptions unless absolutely essential
2. **Convert Lists to Tables**: Transform verbose examples into concise reference tables
3. **Eliminate Redundancy**: Remove repeated information across files
4. **Focus on Purpose**: Describe what components do, not how they're implemented
5. **Extract History**: Move all temporal information to evolution documents

### File Organization Principles

- **Merge Redundant Files**: Combine README.md and overview.md where content overlaps
- **Remove Implementation Details**: Focus on concepts and requirements
- **Maintain Essential References**: Keep critical architecture patterns
- **Preserve Error Patterns**: Keep essential error handling rules for UI compatibility

## Maintenance Rules for Contributors

### When Making Major Changes

1. **Document in Evolution**: Add significant changes to appropriate evolution.md
2. **Update Architecture**: Modify current architecture docs to reflect new state
3. **Preserve History**: Never delete historical information - move to evolution
4. **Test Context Size**: Ensure changes don't cause context explosion

### File Naming Conventions

- `evolution.md` - Historical changes and milestones
- `architecture.md` - Current architectural state
- `errors.md` - Error handling patterns (when interpreter-specific)
- `README.md` - Concise overview (merge with overview.md if both exist)

### Content Guidelines

- **Be Concise**: Favor tables and bullet points over paragraphs
- **Focus on Rules**: Emphasize what must be done, not how to do it
- **Avoid Examples**: Remove detailed code examples unless essential for understanding
- **Maintain Consistency**: Use same terminology across all documents

## Critical Architecture Information

### Always Preserve These Patterns

- Error handling rules (parse errors vs runtime errors)
- Frame structure requirements for UI compatibility
- Shared component interfaces
- Cross-interpreter consistency requirements

### Evolution Tracking Rules

- Date major changes (format: "January 2025" or "2025-01")
- Document rationale for architectural decisions
- Preserve before/after state comparisons
- Track test coverage milestones
- Record object field standardization details

This system ensures LLMs have concise, current guidance while preserving complete project history for context and decision-making.
