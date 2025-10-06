# API Client

## Overview

The Jiki frontend uses a simple, type-safe API client to communicate with the backend Rails API. The client is built with Next.js best practices and provides automatic environment configuration, error handling, and TypeScript support.

## Architecture

The API client lives in `/lib/api/` with three main files:

- **config.ts** - Environment-specific configuration (dev/prod URLs)
- **client.ts** - Core request logic and error handling
- **index.ts** - Public exports for clean imports

## Usage

### Basic Requests

Import the API client anywhere in the application:

```typescript
import { api } from "@/lib/api";

// GET request
const { data } = await api.get("/users");

// POST with body
const { data } = await api.post("/users", {
  name: "John",
  email: "john@example.com"
});

// PUT request
const { data } = await api.put("/users/1", { name: "Jane" });

// DELETE request
await api.delete("/users/1");
```

### With Type Safety

Use generics for full type safety:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Type-safe response
const { data } = await api.get<User[]>("/users");
// data is typed as User[]

const { data: user } = await api.post<User>("/users", {
  name: "John",
  email: "john@example.com"
});
// user is typed as User
```

### Query Parameters

Pass query parameters using the `params` option:

```typescript
const { data } = await api.get("/users", {
  params: {
    page: 1,
    limit: 10,
    search: "john"
  }
});
// Requests: /users?page=1&limit=10&search=john
```

### Custom Headers

Add custom headers when needed:

```typescript
const { data } = await api.post("/users", userData, {
  headers: {
    "X-Custom-Header": "value"
  }
});
```

### Error Handling

The client throws `ApiError` for non-2xx responses:

```typescript
import { api, ApiError } from "@/lib/api";

try {
  const { data } = await api.get("/users/999");
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.status); // 404
    console.log(error.statusText); // "Not Found"
    console.log(error.data); // Server error response body
  } else {
    // Network or other errors
    console.error("Request failed:", error);
  }
}
```

## Common Patterns

### In React Components

```typescript
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await api.get<User[]>("/users");
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### In Server Components (App Router)

```typescript
import { api } from "@/lib/api";

export default async function UsersPage() {
  const { data: users } = await api.get<User[]>("/users");

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### In Server Actions

```typescript
"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  try {
    await api.post("/users", { name, email });
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user"
    };
  }
}
```

### With Custom Hooks

Create reusable hooks for common API operations:

```typescript
import { useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api";

export function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<T>(path);
        setData(response.data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`API Error: ${err.status} ${err.statusText}`);
        } else {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path]);

  return { data, loading, error };
}

// Usage
export function UserProfile({ userId }: { userId: number }) {
  const { data: user, loading, error } = useApi<User>(`/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.name}</div>;
}
```

## Configuration

### Environment Variables

The API client automatically selects the correct backend URL based on environment:

- **Development**: `http://localhost:3061`
- **Production**: Uses `NEXT_PUBLIC_API_URL` environment variable or defaults to `https://api.jiki.com`

To override defaults, create `.env.local`:

```bash
# Custom API URL
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Accessing Configuration

If you need to access the API configuration directly:

```typescript
import { getApiConfig, getApiUrl } from "@/lib/api";

// Get current config
const config = getApiConfig();
console.log(config.baseUrl); // "http://localhost:3061" in dev

// Build a full URL
const url = getApiUrl("/users/1");
// Returns: "http://localhost:3061/users/1" in dev
```

## Best Practices

1. **Always use type parameters** for type-safe responses
2. **Handle errors appropriately** - distinguish between ApiError and network errors
3. **Use loading states** in UI components to show feedback
4. **Centralize common requests** in custom hooks or service functions
5. **Validate responses** when the backend API might return unexpected data

## Testing

When testing components that use the API client:

```typescript
import { api } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

test("fetches users", async () => {
  const mockUsers = [{ id: 1, name: "John" }];
  (api.get as jest.Mock).mockResolvedValue({ data: mockUsers });

  // Your test code here
});
```

## Lesson API Endpoints

### Levels and Lessons

The lesson system uses specific API endpoints for content delivery:

#### Get Levels with Progress

```typescript
import { fetchLevelsWithProgress } from "@/lib/api/levels";

const levels = await fetchLevelsWithProgress();
// Returns: LevelWithProgress[]
```

Response structure:

```typescript
interface Level {
  slug: string;
  lessons: Array<{
    slug: string;
    type: "exercise" | "video";
  }>;
}
```

#### Get Lesson Details

```typescript
import { fetchLesson } from "@/lib/api/lessons";

const lesson = await fetchLesson("solve-a-maze");
// Returns: LessonData
```

Response structure:

```typescript
interface LessonData {
  slug: string;
  type: "exercise" | "video";
  title: string;
  description?: string;
  data?: {
    sources?: Array<{
      host: string; // e.g., "mux"
      id: string; // Video playback ID
    }>;
  };
}
```

#### Mark Lesson Complete

```typescript
import { markLessonComplete } from "@/lib/api/lessons";

await markLessonComplete("solve-a-maze");
```

### Usage in Components

```typescript
// In lesson page
useEffect(() => {
  async function loadLesson() {
    try {
      const lessonData = await fetchLesson(slug);
      setLesson(lessonData);

      // For video lessons, extract playback ID
      if (lessonData.type === "video") {
        const playbackId = lessonData.data?.sources?.[0]?.id;
        // Use with MuxPlayer
      }
    } catch (error) {
      console.error("Failed to load lesson:", error);
    }
  }
  void loadLesson();
}, [slug]);
```

## Related Documentation

- [Architecture](./architecture.md) - Overall frontend architecture
- [Testing](./testing.md) - Testing patterns and guidelines
- [Lessons](./lessons.md) - Lesson system documentation
- [Exercises](./exercises.md) - Exercise system details
