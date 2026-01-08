# Lesson System

The lesson system provides a unified way to deliver both video content and coding exercises through a single routing structure.

## Navigation

- **Context Root**: [.context/README.md](./README.md)
- **Related**:
  - [Exercise System](./exercises.md) - Coding exercise details
  - [API Documentation](./api.md) - Backend integration
  - [Architecture](./architecture.md) - Routing structure

## Overview

Lessons are the atomic units of learning in Jiki. Each lesson can be either:

- **Video**: Educational video content delivered via Mux
- **Exercise**: Interactive coding challenges using the CodingExercise system

## Data Structure

### Level Structure (from `/levels` API)

```typescript
interface Level {
  slug: string; // e.g., "your-first-program"
  lessons: Lesson[];
}

interface Lesson {
  slug: string; // e.g., "solve-a-maze"
  type: "exercise" | "video";
}
```

### Lesson Details (from `/lessons/:slug` API)

```typescript
interface LessonData {
  slug: string;
  type: "exercise" | "video";
  title: string;
  description?: string;
  data?: {
    sources?: VideoSource[]; // For video lessons
  };
}

interface VideoSource {
  host: string; // e.g., "mux"
  id: string; // The video playback ID
}
```

## Routing Structure

### Dashboard (`/dashboard`)

Displays all levels and their lessons in a hierarchical structure:

- Levels are shown as sections with headers
- Lessons are displayed as interactive nodes within each level
- Progressive unlocking based on completion status

### Lesson Route (`/lesson/[slug]`)

Dynamic route that loads the appropriate component based on lesson type:

- Fetches lesson details from `/lessons/:slug` API endpoint
- Routes to `VideoExercise` component for video lessons
- Routes to `CodingExercise` component for coding exercises

## Components

### VideoExercise (`/components/video-exercise/VideoExercise.tsx`)

Handles video lesson playback:

- Uses MuxPlayer for video streaming
- Extracts playback ID from `lessonData.data.sources[0].id`
- Features:
  - Autoplay with graceful fallback
  - Skip video with confirmation dialog
  - Automatic progress tracking on completion
  - Integration with lesson quit button

### CodingExercise Integration

For coding exercises:

- Maps lesson slugs to exercise slugs in the curriculum
- Currently uses `maze-solve-basic` as default (temporary)
- Future: Backend should provide exercise slug mapping

## API Integration

### Fetching Lessons

```typescript
// lib/api/lessons.ts
export async function fetchLesson(slug: string): Promise<LessonData> {
  const response = await api.get(`/lessons/${slug}`);
  return response.data.lesson || response.data;
}
```

### Marking Completion

```typescript
export async function markLessonComplete(slug: string): Promise<void> {
  await api.post(`/lessons/${slug}/complete`);
}
```

## Dashboard Display

The ExercisePath component (`/components/index-page/exercise-path/ExercisePath.tsx`):

1. Maps levels to sections with headers
2. Creates lesson nodes with zigzag positioning
3. Shows completion status and locks based on progression
4. Connects nodes with path lines

### Level Section Structure

```typescript
interface LevelSection {
  levelSlug: string;
  levelTitle: string;
  lessons: Exercise[]; // UI representation of lessons
  isLocked: boolean;
}
```

## Development Workflow

### Testing Video Lessons

Use `/dev/video-exercise` with mock data:

```typescript
const mockLessonData: LessonData = {
  slug: "welcome-video",
  type: "video",
  title: "Welcome!",
  data: {
    sources: [
      {
        host: "mux",
        id: "PNbgUkVhy38y7OELdYseo1GAD01XG8FGLJ1nj9BvuKCU"
      }
    ]
  }
};
```

### Adding New Lessons

1. Backend adds lesson to level structure
2. Frontend automatically displays in dashboard
3. Lesson page fetches details and renders appropriate component
4. No frontend changes needed for new content

## Current Limitations & TODOs

1. **Exercise Mapping**: Currently hardcoded to `maze-solve-basic`
   - TODO: Backend should provide curriculum exercise slug
   - Or: Create exercises matching lesson slugs

2. **Video Providers**: Currently only supports Mux
   - Structure allows for other providers via `host` field
   - Would need component updates for non-Mux providers

3. **Progress Persistence**: Relies on backend tracking
   - Frontend marks completion via API
   - Dashboard refetch shows updated progress

## Best Practices

1. **Type Safety**: Use TypeScript interfaces for all API responses
2. **Error Handling**: Show meaningful errors when lessons fail to load
3. **Loading States**: Always show loading indicators during API calls
4. **Responsive Design**: Video player adapts to screen size
5. **User Experience**: Allow skipping videos but track completion
