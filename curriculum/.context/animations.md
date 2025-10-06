# Animations

## Overview

Animations are the visual feedback mechanism that makes code execution visible and engaging in Jiki. When students call functions in their code, exercises generate animations that show the effects, turning abstract programming concepts into concrete visual experiences.

## Animation Architecture

### Animation Interface

The curriculum defines a platform-agnostic animation format:

```typescript
interface Animation {
  targets: string; // CSS selector for animated element(s)
  offset: number; // Start time in milliseconds
  duration?: number; // Animation duration (default: 300ms)
  easing?: string; // Easing function (default: "easeInOutQuad")
  transformations: {
    left?: number; // Absolute position
    top?: number; // Absolute position
    translateX?: number; // Relative translation
    translateY?: number; // Relative translation
    rotate?: number; // Rotation in degrees
    scale?: number; // Scale factor
    opacity?: number; // Opacity (0-1)
  };
}
```

### Frontend Conversion

The frontend converts these animations to anime.js:

```typescript
// Curriculum generates:
{
  targets: "#player",
  offset: 1000,
  duration: 500,
  transformations: {
    translateX: 100
  }
}

// Frontend converts to:
timeline.add({
  targets: "#player",
  translateX: 100,
  duration: 500,
  easing: "easeInOutQuad"
}, 1000);
```

## Creating Animations

### Basic Movement

```typescript
func: (ctx: ExecutionContext) => {
  this.playerX += 50;
  this.animations.push({
    targets: "#player",
    offset: ctx.currentTime,
    duration: 300,
    transformations: {
      translateX: this.playerX
    }
  });
};
```

### Simultaneous Animations

Multiple elements can animate together:

```typescript
func: (ctx: ExecutionContext) => {
  // Move player
  this.animations.push({
    targets: "#player",
    offset: ctx.currentTime,
    duration: 500,
    transformations: { translateY: -50 }
  });

  // Fade out obstacle
  this.animations.push({
    targets: "#obstacle-1",
    offset: ctx.currentTime, // Same time
    duration: 500,
    transformations: { opacity: 0 }
  });
};
```

### Sequential Animations

Chain animations using offsets:

```typescript
func: (ctx: ExecutionContext) => {
  const startTime = ctx.currentTime;

  // First: Move right
  this.animations.push({
    targets: "#player",
    offset: startTime,
    duration: 300,
    transformations: { translateX: 100 }
  });

  // Then: Rotate
  this.animations.push({
    targets: "#player",
    offset: startTime + 300, // After first animation
    duration: 200,
    transformations: { rotate: 90 }
  });
};
```

## Timing System

### ExecutionContext

The `ExecutionContext` from interpreters provides accurate timing:

```typescript
interface ExecutionContext {
  currentTime: number; // Current execution time in ms
  frameNumber: number; // Current execution frame
  // ... other properties
}
```

### Time Management Best Practices

1. **Always use ctx.currentTime**: Ensures sync with code execution
2. **Account for duration**: When chaining, add duration to offset
3. **Consider overlap**: Animations can run simultaneously
4. **Default durations**: Use 300ms for standard movements

## Animation Properties

### Position Properties

- **left/top**: Absolute positioning (pixels)
- **translateX/translateY**: Relative movement from original position
- Use translate for movement, position for placement

### Transform Properties

- **rotate**: Rotation in degrees (positive = clockwise)
- **scale**: Size multiplier (1 = normal, 2 = double size)
- Transforms are cumulative across animations

### Visual Properties

- **opacity**: Transparency (0 = invisible, 1 = opaque)
- Useful for fade in/out effects

## Advanced Techniques

### Easing Functions

Common easing functions:

- `"linear"`: Constant speed
- `"easeInOutQuad"`: Smooth start and end (default)
- `"easeOutElastic"`: Bouncy finish
- `"easeInExpo"`: Accelerating start

### Dynamic Targets

Select multiple elements:

```typescript
this.animations.push({
  targets: ".enemy", // All elements with class "enemy"
  offset: ctx.currentTime,
  transformations: { scale: 0 }
});
```

### Conditional Animations

Animations based on state:

```typescript
func: (ctx: ExecutionContext) => {
  if (this.hasKey) {
    this.animations.push({
      targets: "#door",
      offset: ctx.currentTime,
      transformations: { opacity: 0 }
    });
  } else {
    this.animations.push({
      targets: "#player",
      offset: ctx.currentTime,
      duration: 100,
      transformations: { translateX: this.playerX - 10 } // Bounce back
    });
  }
};
```

## Performance Considerations

### Optimization Tips

1. **Batch animations**: Create all animations for a frame together
2. **Reuse selectors**: Cache selector strings
3. **Limit simultaneous animations**: Too many can cause lag
4. **Simple transforms**: Prefer translate over position changes

### Memory Management

```typescript
class Exercise {
  reset() {
    this.animations = []; // Clear animations for replay
    this.resetState();
  }
}
```

## Visual Design Guidelines

### Consistency

- **Duration standards**: 300ms for moves, 200ms for rotations
- **Easing patterns**: Use same easing for similar actions
- **Visual language**: Consistent meanings (fade = disappear)

### Clarity

- **One concept per animation**: Don't combine unrelated changes
- **Readable speed**: Not too fast or slow
- **Visual hierarchy**: Important changes should be prominent

### Feedback

- **Immediate response**: Animations start at function call
- **Success indicators**: Green flash, scale pulse, etc.
- **Error feedback**: Red shake, bounce back, etc.

## Testing Animations

### Unit Tests

Test that animations are generated correctly:

```typescript
it("should create movement animation", () => {
  const exercise = new TestExercise();
  const ctx = { currentTime: 1000 };

  exercise.moveRight(ctx);

  expect(exercise.animations).toHaveLength(1);
  expect(exercise.animations[0]).toMatchObject({
    targets: "#player",
    offset: 1000,
    transformations: { translateX: 50 }
  });
});
```

### Integration Tests

Verify animation sequences:

```typescript
it("should chain animations correctly", () => {
  const exercise = new TestExercise();

  exercise.moveAndRotate({ currentTime: 0 });

  expect(exercise.animations[0].offset).toBe(0);
  expect(exercise.animations[1].offset).toBe(300); // After first
});
```

## Common Patterns

### Movement Pattern

```typescript
moveInDirection(direction: string, ctx: ExecutionContext) {
  const distance = 50;
  switch(direction) {
    case "up":    this.y -= distance; break;
    case "down":  this.y += distance; break;
    case "left":  this.x -= distance; break;
    case "right": this.x += distance; break;
  }

  this.animations.push({
    targets: "#player",
    offset: ctx.currentTime,
    duration: 300,
    transformations: {
      translateX: this.x,
      translateY: this.y
    }
  });
}
```

### State Change Pattern

```typescript
collectItem(itemId: string, ctx: ExecutionContext) {
  // Fade out item
  this.animations.push({
    targets: `#${itemId}`,
    offset: ctx.currentTime,
    duration: 200,
    transformations: { opacity: 0, scale: 1.2 }
  });

  // Update score display
  this.animations.push({
    targets: "#score",
    offset: ctx.currentTime + 200,
    duration: 300,
    easing: "easeOutElastic",
    transformations: { scale: 1.1 }
  });
}
```

## Future Enhancements

- **3D Animations**: Support for 3D transforms
- **SVG Animations**: Path animations, morphing
- **Particle Effects**: Explosions, sparkles, trails
- **Timeline Scrubbing**: Step through animations
- **Animation Presets**: Reusable animation templates
