export interface DiffCell {
  text: string;
  changed: boolean;
}

/** One aligned row of the side-by-side view; a null side renders as a spacer. */
export interface DiffRow {
  left: DiffCell | null;
  right: DiffCell | null;
}

// Above this many LCS cells the quadratic table isn't worth building for a
// highlight; the rows just pair up index-wise, unhighlighted.
const MAX_CELLS = 500_000;

/**
 * Line-level diff of two texts via longest-common-subsequence, shaped for a
 * side-by-side view: matching lines share a row, differing runs are paired up
 * index-wise and marked changed, and the shorter side of a run gets nulls so
 * both columns stay the same height.
 */
export function diffLines(left: string, right: string): DiffRow[] {
  const a = left.split("\n");
  const b = right.split("\n");

  if (a.length * b.length > MAX_CELLS) {
    return Array.from({ length: Math.max(a.length, b.length) }, (_, k) => ({
      left: k < a.length ? { text: a[k], changed: false } : null,
      right: k < b.length ? { text: b[k], changed: false } : null
    }));
  }

  const lcs: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const rows: DiffRow[] = [];
  let pendingLeft: DiffCell[] = [];
  let pendingRight: DiffCell[] = [];

  const flushPending = () => {
    for (let k = 0; k < Math.max(pendingLeft.length, pendingRight.length); k++) {
      rows.push({ left: pendingLeft[k] ?? null, right: pendingRight[k] ?? null });
    }
    pendingLeft = [];
    pendingRight = [];
  };

  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      flushPending();
      rows.push({ left: { text: a[i], changed: false }, right: { text: b[j], changed: false } });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      pendingLeft.push({ text: a[i], changed: true });
      i++;
    } else {
      pendingRight.push({ text: b[j], changed: true });
      j++;
    }
  }
  while (i < a.length) {
    pendingLeft.push({ text: a[i], changed: true });
    i++;
  }
  while (j < b.length) {
    pendingRight.push({ text: b[j], changed: true });
    j++;
  }
  flushPending();

  return rows;
}
