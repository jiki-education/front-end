# Time Scales in Interpreters

The interpreter system uses microseconds as its primary time unit for fine-grained execution tracking.

## Core Concepts

### Microseconds (Primary Unit)

- **Purpose**: Keep individual expression frames from consuming visible timeline space
- **Used by**: All interpreter implementations (JikiScript, Python, etc.)
- **Frame.time field**: Always in microseconds
- **Benefits**: Complex expressions create multiple frames but advance time minimally (e.g., 4 frames for `if(x == 4/3)` advance only 4 microseconds), maintaining order without timeline clutter

### Milliseconds (Converted for UI)

- **Purpose**: Compatibility with frontend animation libraries
- **Frame.timeInMs field**: Milliseconds (converted from microseconds)
- **Calculation**: `timeInMs = time / TIME_SCALE_FACTOR`

### TIME_SCALE_FACTOR

- **Value**: 1000
- **Location**: Exported from `src/shared/frames.ts`
- **Usage**: Standard conversion between microseconds and milliseconds

## Implementation

### Frame Creation

When creating frames in the interpreter:

```typescript
const frame: Frame = {
  time: this.time, // Microseconds
  timeInMs: Math.round(this.time / TIME_SCALE_FACTOR), // Milliseconds
  line: lineNumber,
  status: "SUCCESS",
  // ... other fields
};
```

### Time Increments

- Small operations: 0.01 microseconds (avoid timeline clutter)
- Standard operations: 100-1000 microseconds
- Complex operations: May accumulate larger times

## Important Notes

1. **Always track in microseconds**: The interpreter should internally use microseconds
2. **Convert at frame creation**: Calculate timeInMs when creating Frame objects
3. **Use TIME_SCALE_FACTOR**: Never hardcode the conversion factor
4. **Precision matters**: Microseconds allow tracking very small operations

## Testing

When testing interpreter output:

- Verify both `time` and `timeInMs` fields are present
- Check that `timeInMs = Math.round(time / 1000)`
- Ensure time increments are reasonable for the operations
