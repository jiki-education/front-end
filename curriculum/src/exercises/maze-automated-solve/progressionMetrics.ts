import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type MazeAutomatedSolveExercise from "./Exercise";

// Names the sensing functions appear under across languages.
const SENSING_CALL_NAMES = ["can_move", "canMove", "can_turn_left", "canTurnLeft", "can_turn_right", "canTurnRight"];

// Fraction of the route to the target the character has covered, measured as
// the drop in BFS distance-to-target between the start cell and the
// character's final position. Read entirely from the run's exercise state
// (grid and final position), so halted runs still score their partial
// progress. Candidate for the progression stdlib once shared-file edits are
// possible - maze exercises duplicate this helper for now.
function pathProgress(ex: MazeAutomatedSolveExercise | undefined): number {
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

// Average partial progress across every primary maze run.
function averagePathProgress(runs: ScenarioRuns): number {
  const primary = runs.all.filter((run) => run.isolated !== true && run.bonus !== true);
  if (primary.length === 0) {
    return 0;
  }
  const total = primary.reduce(
    (sum, run) => sum + pathProgress(run.exercise as MazeAutomatedSolveExercise | undefined),
    0
  );
  return total / primary.length;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress inside failing mazes, averaged across all six
      // scenarios (each scenario passing already moves the anchor).
      name: "path_progress",
      maxScore: 1,
      points: 4,
      score: averagePathProgress
    },
    {
      // The exercise's headline concept: sensing the maze with can_move /
      // can_turn_left / can_turn_right instead of hardcoding a route. Any
      // runtime call to a sensing function shows the student has started
      // reacting to the maze.
      name: "used_sensing",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const sensed = runs.all.some(
          (run) => run.result?.meta.functionCallLog.some((entry) => SENSING_CALL_NAMES.includes(entry.name)) === true
        );
        return sensed ? 1 : 0;
      }
    }
  ]
};
