import type { ProgressionMetrics } from "../types";
import type MazeSolveWalkExercise from "./Exercise";

const SCENARIO_SLUG = "maze-1";

// Fraction of the route to the target the character has covered, measured as
// the drop in BFS distance-to-target between the start cell and the
// character's final position. Read entirely from the run's exercise state
// (grid and final position), so halted runs still score their partial
// progress. Candidate for the progression stdlib once shared-file edits are
// possible - maze exercises duplicate this helper for now.
function pathProgress(ex: MazeSolveWalkExercise | undefined): number {
  if (!ex || ex.grid.length === 0) {
    return 0;
  }
  const grid = ex.grid;

  let start: [number, number] | undefined;
  let target: [number, number] | undefined;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 2) start = [row, col];
      if (grid[row][col] === 3) target = [row, col];
    }
  }
  if (!start || !target) {
    return 0;
  }

  // BFS outwards from the target across walkable (non-wall) cells
  const distances = grid.map((row) => row.map(() => Infinity));
  distances[target[0]][target[1]] = 0;
  const queue: [number, number][] = [target];
  for (let i = 0; i < queue.length; i++) {
    const [row, col] = queue[i];
    for (const [dRow, dCol] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ]) {
      const nRow = row + dRow;
      const nCol = col + dCol;
      if (nRow < 0 || nRow >= grid.length || nCol < 0 || nCol >= grid[nRow].length) continue;
      if (grid[nRow][nCol] === 1) continue;
      if (distances[nRow][nCol] !== Infinity) continue;
      distances[nRow][nCol] = distances[row][col] + 1;
      queue.push([nRow, nCol]);
    }
  }

  const startDistance = distances[start[0]][start[1]];
  const finalDistance = distances[ex.characterRow]?.[ex.characterCol];
  if (!Number.isFinite(startDistance) || startDistance === 0) {
    return 0;
  }
  if (finalDistance === undefined || !Number.isFinite(finalDistance)) {
    return 0;
  }
  return Math.min(Math.max((startDistance - finalDistance) / startDistance, 0), 1);
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress through the maze on a failing run.
      name: "path_progress",
      maxScore: 1,
      points: 4,
      score: (runs) => pathProgress(runs.bySlug(SCENARIO_SLUG)?.exercise as MazeSolveWalkExercise | undefined)
    },
    {
      // The exercise's headline concept: passing a step count into walk().
      // A completed walk(n) with n >= 2 appears in the runtime call log;
      // grinding with walk(1) everywhere never does. (Calls that hit a wall
      // mid-stride abort before logging, so only completed strides count.)
      name: "walked_in_strides",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const run = runs.bySlug(SCENARIO_SLUG);
        if (!run?.result) {
          return 0;
        }
        const strode = run.result.meta.functionCallLog.some(
          (entry) => entry.name === "walk" && typeof entry.args[0] === "number" && entry.args[0] >= 2
        );
        return strode ? 1 : 0;
      }
    }
  ]
};
