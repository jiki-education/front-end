# Lesson Progress Animation System

## Overview

Implement a sequential animation system for the dashboard that visually shows when a lesson is completed and the next lesson is unlocked.

## Animation Sequence

### Phase 1: Lesson Completion (800ms)

When a user completes a lesson:

1. **0-400ms**: Background transitions from white/purple to green
2. **400ms**: Scale pulse effect (1.0 → 1.05 → 1.0)
3. **400-800ms**: Checkmark icon appears with rotation animation
4. **500-800ms**: Connecting line below turns green and grows downward

### Phase 2: Next Lesson Unlock (600ms)

After completion animation:

1. **0-300ms**: Lock icon on next lesson rotates and fades out
2. **0-600ms**: Lesson opacity transitions from 0.5 to 1.0
3. **300-600ms**: Slight scale bounce (0.95 → 1.02 → 1.0)
4. **600ms**: Lesson enters "in-progress" state with purple border

## Implementation Plan

### 1. State Management

Create `useProgressAnimation` hook to manage animation states:

```typescript
interface AnimationState {
  completingLessonSlug: string | null;
  unlockingLessonSlug: string | null;
  animationPhase: "completing" | "unlocking" | "idle";
}
```

### 2. Component Structure

#### Files to modify:

- `components/dashboard/exercise-path/hooks/useProgressAnimation.ts` (new)
- `components/dashboard/exercise-path/ui/LessonNode.tsx`
- `components/dashboard/exercise-path/ExercisePath.module.css`
- `components/dashboard/exercise-path/ExercisePath.tsx`

#### Files to integrate with:

- `components/dashboard/exercise-path/hooks/useLessonNavigation.ts`
- `lib/api/lessons.ts` (for completion API calls)

### 3. CSS Animation Classes

#### Completion Animation

- `.animating-complete`: Main completion animation
- `.animating-complete::after`: Checkmark appearance
- `.animating-complete::before`: Line color transition

#### Unlock Animation

- `.animating-unlock`: Main unlock animation
- `.animating-unlock::after`: Lock icon disappearance
- Removes `.locked` opacity during animation

### 4. Integration Points

#### Trigger Conditions

- API response after lesson completion
- Only animate if there's a next lesson in the sequence
- Skip animation if user navigates away during animation

#### Data Flow

1. User completes lesson → API call
2. API returns updated lesson states
3. Animation hook identifies completed and next lesson
4. Sequential animation plays
5. Final state updates after animation completes

## Technical Considerations

### Performance

- Use CSS animations (GPU-accelerated) instead of JavaScript
- Implement `will-change` property for animated elements
- Clean up animation classes after completion

### Edge Cases

- User navigates away during animation
- Multiple lessons completed quickly
- Last lesson in level (no next lesson to unlock)
- Network failure during API call

### Accessibility

- Respect `prefers-reduced-motion` setting
- Ensure animations don't interfere with screen readers
- Maintain keyboard navigation during animations

## Testing Strategy

### Unit Tests

- Animation state transitions
- Hook behavior with different inputs
- CSS class application logic

### Integration Tests

- Full animation sequence
- API integration
- State updates after animation

### Visual Testing

- Animation timing and smoothness
- Different viewport sizes
- Browser compatibility

## Future Enhancements

### Phase 2 Features

- Sound effects for completion/unlock
- Particle effects on milestone completion
- Progress streak animations
- XP gain number animation

### Customization Options

- User preference for animation speed
- Toggle animations on/off
- Different animation styles (themes)

## Dependencies

- No external animation libraries needed
- Pure CSS animations with React state management
- Existing API endpoints for lesson completion

## Timeline

1. **Day 1**: Implement hook and state management
2. **Day 2**: Add CSS animations
3. **Day 3**: Component integration
4. **Day 4**: Testing and refinement
5. **Day 5**: Edge cases and accessibility
