# Curriculum Type Strategy

This document outlines the type strategy for the curriculum package and how types flow between curriculum and fe.

## Overview

The curriculum package defines exercises that produce animations and state. These need to be consumed by the fe package which uses anime.js for animation rendering. This document explains how we maintain type safety across this boundary.

## Type Architecture

### Animation Type

The `Animation` interface is defined in `src/Exercise.ts` and represents the animation data that exercises produce:

```typescript
export interface Animation {
  targets: string; // CSS selector for the element to animate
  offset: number; // Time offset in milliseconds
  transformations: {
    // Subset of anime.js AnimationParams that exercises use
    left?: number;
    top?: number;
    translateX?: number;
    translateY?: number;
    rotate?: number;
    scale?: number;
    opacity?: number;
    duration?: number;
    easing?: string;
  };
}
```

### ExecutionContext Type

The `ExecutionContext` type is imported from `@jiki/interpreters` and provides timing control for exercises:

```typescript
import type { ExecutionContext } from "@jiki/interpreters";

// Used in exercise functions
func: (ctx: ExecutionContext) => void;
```

### Exercise State Type

Exercise state is defined as a record of primitive values:

```typescript
getState(): Record<string, number | string | boolean>;
```

## Type Flow

### From Curriculum to FE

1. **Exercises produce animations** with the `Animation` type
2. **FE imports** `Animation` from `@jiki/curriculum`
3. **FE's AnimationTimeline** accepts `Animation[]` and converts to anime.js types

### Type Conversion in FE

The `populateTimeline` method in fe's AnimationTimeline handles the conversion:

```typescript
public populateTimeline(animations: CurriculumAnimation[], frames: Frame[] = []): this {
  animations.forEach((animation) => {
    const { targets, offset, transformations } = animation;

    // Safe cast because curriculum's transformations are a subset of AnimationParams
    this.animationTimeline.add(
      targets as TargetsParam,
      transformations as AnimationParams,
      offset as TimelinePosition
    );
  });
}
```

## Type Safety Guarantees

1. **No `any` types** - All types are explicitly defined
2. **No `unknown` types** - Everything has proper types
3. **Compile-time checking** - TypeScript ensures curriculum animations are compatible with anime.js
4. **Clear boundaries** - Curriculum defines what it produces, fe handles conversion

## Adding New Animation Properties

When adding new animation properties:

1. Add the property to the `Animation.transformations` interface in `Exercise.ts`
2. Ensure the property name and type match anime.js's AnimationParams
3. TypeScript will validate compatibility in fe's populateTimeline

## Benefits

- **Independence**: Curriculum doesn't depend on anime.js types
- **Type safety**: Full TypeScript checking across package boundaries
- **Maintainability**: Clear separation of concerns
- **Evolution**: Can evolve curriculum animations without breaking fe (as long as we stay compatible)
