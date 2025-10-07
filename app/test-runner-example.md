# Test Runner Example Code

To test the minimal test runner implementation, use this code in the CodingExercise component:

```javascript
// Student code that should pass the tests
move();
move();
move();
move();
move();
```

## Expected Results:

### Scenario 1: Starting from position 0

- Initial position: 0
- After 5 moves: 100 (✓ Pass)

### Scenario 2: Starting from position 50

- Initial position: 50
- After 5 moves: 150 (✓ Pass)

## Visual Display:

The exercise view should show:

- A horizontal track with grid marks every 100px
- A blue circle (character) that moves to the final position
- A position label showing the current position

## Frames and Scrubber:

- Each `move()` call generates a frame
- The scrubber should allow navigation through the 5 frames
- Animations should play when using the play button

## Testing Different Outcomes:

### To make tests fail:

```javascript
// Only 3 moves - tests will fail
move();
move();
move();
```

### To see errors:

```javascript
// Syntax error
move(
```

### To see no movement:

```javascript
// Empty code - character doesn't move
```
