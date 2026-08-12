// The fake program the demo runs, and an interpreter that emits the actions that play out on screen.

/** The board: 11 columns, 3 rows, with row 0 at the bottom. */
export const COLS = 11;

/** Two aliens stacked in column 6, so one left-to-right sweep can't clear them all. */
export const ALIENS = [
  { col: 2, row: 0 },
  { col: 4, row: 1 },
  { col: 6, row: 0 },
  { col: 6, row: 1 },
  { col: 8, row: 2 },
  { col: 10, row: 0 }
] as const;

/** Percent from the top for rows 0 (bottom) upwards. */
export const ROW_TOP = [50, 32, 14];

/** Centre of a column, as a percentage across the playfield. */
export function colX(col: number) {
  return ((col - 0.5) / COLS) * 100;
}

export type GameAction =
  | { type: "move"; col: number }
  | { type: "shoot"; col: number; target: number }
  | { type: "error" }
  | { type: "win" };

/**
 * Run the program with a given turn-around boundary and record what happens. The buggy 20 walks the
 * cannon off the edge (the error to fix); the correct 11 turns at the last column and clears the board.
 */
export function simulate(bound: number): GameAction[] {
  const actions: GameAction[] = [];
  const live = ALIENS.map(() => true);
  let col = 1;
  let pos = 1;

  // Bounded rather than `while (true)` so a non-turning boundary can't spin forever; never bites in practice.
  for (let guard = 0; guard < 60; guard++) {
    const target = lowestAliveIn(col, live);
    if (target !== -1) {
      live[target] = false;
      actions.push({ type: "shoot", col, target });
      if (live.every((v) => !v)) {
        actions.push({ type: "win" });
        return actions;
      }
    }

    if (pos < bound) {
      col += 1;
      pos += 1;
    } else {
      col -= 1;
    }

    if (col < 1 || col > COLS) {
      actions.push({ type: "error" });
      return actions;
    }
    actions.push({ type: "move", col });
  }

  return actions;
}

/** The board mid-run: what is on screen once the first `step` actions of a run have played. */
export interface Board {
  deadAliens: boolean[];
  col: number;
  offEdge: boolean;
}

/**
 * Replay the first `step` actions of a run and report the board they leave. Deriving the board from
 * the run rather than accumulating it is what lets the scrubber go backwards: seeking to an earlier
 * step brings the aliens killed after it back to life.
 */
export function boardAt(actions: readonly GameAction[], step: number): Board {
  const board: Board = { deadAliens: ALIENS.map(() => false), col: 1, offEdge: false };

  actions.slice(0, step).forEach((act) => {
    if (act.type === "move") board.col = act.col;
    if (act.type === "shoot") board.deadAliens[act.target] = true;
    if (act.type === "error") board.offEdge = true;
  });

  return board;
}

/** The alien a shot from this column would hit: the lowest one still alive. */
export function lowestAliveIn(col: number, live: readonly boolean[]) {
  let best = -1;
  let bestRow = Infinity;
  ALIENS.forEach((alien, i) => {
    if (!live[i] || alien.col !== col) return;
    if (alien.row < bestRow) {
      bestRow = alien.row;
      best = i;
    }
  });
  return best;
}
