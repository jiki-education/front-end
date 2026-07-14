import { locMetric } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type MazeTurnAroundExercise from "./Exercise";

// Fraction of the route to the target the character has covered, measured as
// the drop in BFS distance-to-target between the start cell and the
// character's final position. Read entirely from the run's exercise state
// (grid and final position), so halted runs still score their partial
// progress. Candidate for the progression stdlib once shared-file edits are
// possible - maze exercises duplicate this helper for now.
function pathProgress(ex: MazeTurnAroundExercise | undefined): number {
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

// Average partial progress across the primary (non-bonus) maze runs.
function averagePathProgress(runs: ScenarioRuns): number {
  const primary = runs.all.filter((run) => run.isolated !== true && run.bonus !== true);
  if (primary.length === 0) {
    return 0;
  }
  const total = primary.reduce((sum, run) => sum + pathProgress(run.exercise as MazeTurnAroundExercise | undefined), 0);
  return total / primary.length;
}

// The turn_around() function itself is covered by the visible code checks,
// so no metric re-derives it. What the scenarios can't see: how far a solver
// that fails those checks still gets, and the shrink toward the bonus target.
export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress through the two dead-end mazes - a working solver
      // carried over from the previous lesson scores here even while the
      // turn_around() code checks fail.
      name: "path_progress",
      maxScore: 1,
      points: 4,
      score: averagePathProgress
    },
    // Matches the exercise's "17 lines of code or fewer" bonus target.
    locMetric({ target: 17, points: 3 })
  ]
};
