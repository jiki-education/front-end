# JikiScript Interpreter

JikiScript is an educational programming language with simplified JavaScript-like syntax, designed to help students learn programming concepts through Jiki's interactive visual environment.

## Overview

JikiScript executes student code while generating detailed execution traces that power Jiki's educational features:

- **Frame-by-frame visualization**: Every execution step is captured as a "frame"
- **Time scrubbing**: Students can navigate through execution like a video timeline
- **Variable tracking**: See how variable values change over time
- **Educational descriptions**: Plain-language explanations of what each line does
- **Progressive syntax**: Language features can be enabled/disabled to match learning level

## Target Audience

- **Primary**: Students learning to code for the first time
- **Secondary**: Educators analyzing student submissions and providing feedback

## Language Design Philosophy

JikiScript uses familiar JavaScript syntax but with educational enhancements:

- **JikiObjects**: Wrapper objects around primitives for better tracking and feedback
- **Descriptive errors**: Friendly error messages that guide learning
- **Configurable syntax**: Gradually introduce language features as students progress
- **Educational stdlib**: Built-in functions designed for learning scenarios

## Integration with Jiki UI

The interpreter generates a standardized frame format that feeds into Jiki's UI:

1. **Execution frames**: Each step of code execution
2. **Variable states**: Snapshots of all variables at each frame
3. **Educational descriptions**: Human-readable explanations of execution steps
4. **Error contexts**: Rich error information for debugging assistance

This same frame format will be used by the planned JavaScript and Python interpreters, providing a consistent learning experience across languages.
