# Sound System

Audio feedback system using singleton pattern with preloaded sounds.

## Architecture

- **SoundManager** (`lib/sound/SoundManager.ts`) - Singleton managing all playback
- **playSound** (`lib/sound/index.ts`) - Global function for playing sounds
- **useSound** (`lib/sound/useSound.ts`) - React hook with mute/volume controls
- **Types** (`lib/sound/types.ts`) - TypeScript definitions

## How It Works

1. **Initialization**: SoundManager singleton created on first import
2. **Preloading**: Sounds loaded from `/public/sounds/` on startup
3. **Playback**: Clones audio element to allow overlapping plays
4. **Persistence**: Mute state saved to localStorage (`soundMuted` key)

## Usage

### Direct Function (Most Common)

```typescript
import { playSound } from "@/lib/sound";

playSound("success");
playSound("error", { volume: 0.3 });
```

### React Hook (When Need Controls)

```typescript
import { useSound } from "@/lib/sound";

const { playSound, muted, toggleMute, setVolume } = useSound();
```

## Adding New Sounds

1. Add file to `/public/sounds/`
2. Update `SoundName` type in `lib/sound/types.ts`
3. Add mapping in `SoundManager.preloadSounds()`:

```typescript
const soundFiles: Record<SoundName, string> = {
  success: "success.wav",
  error: "error.wav",
  newSound: "new-sound.wav" // Add here
};
```

## Current Sounds

- `success` - Positive feedback (quiz correct, form valid)
- `error` - Negative feedback (quiz wrong, validation error)

## Configuration

- **basePath**: Sound directory (default: `/sounds`)
- **defaultVolume**: 0-1 (default: 0.5)
- **volume**: Per-play override
- **loop**: Repeat playback
