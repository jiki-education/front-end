/**
 * The fake program the demo runs, and an interpreter for it.
 *
 * The demo is not a screencast: the landing page ships in 50+ locales and one capture per
 * locale is not viable, so the editor and game are drawn in DOM. That means the game has to
 * actually be simulated rather than hand-keyframed — walk the program, track the cannon, and
 * emit the actions that play out on screen. Change the boundary value and the run changes with
 * it, which is the whole point of the beat where the learner fixes the bug.
 */

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
 * Run the program with a given turn-around boundary and record what happens.
 *
 * With the buggy boundary (20) `position` never reaches it, so the cannon only ever moves
 * right and walks off the edge — that overshoot is the error the learner has to fix. With the
 * correct boundary (11) it turns at the last column, comes back, and clears the stack in
 * column 6 on the return pass.
 */
export function simulate(bound: number): GameAction[] {
  const actions: GameAction[] = [];
  const live = ALIENS.map(() => true);
  let col = 1;
  let pos = 1;

  // Bounded rather than `while (true)`: a boundary that never turns the cannon around would
  // otherwise spin forever. The cannon leaves the board long before this, so it never bites.
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

/**
 * The alien a shot from this column would hit: the lowest one still alive, since the shot
 * stops at the first thing it meets on the way up.
 */
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
