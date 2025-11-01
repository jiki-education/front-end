// Auto-generated or manually maintained registry
export const exercises = {
  "basic-movement": () => import("./basic-movement"),
  "maze-solve-basic": () => import("./maze-solve-basic"),
  acronym: () => import("./acronym")
  // Future exercises will be added here:
  // 'loop-basics': () => import('./loop-basics'),
  // 'conditionals': () => import('./conditionals'),
} as const;

export type ExerciseSlug = keyof typeof exercises;
