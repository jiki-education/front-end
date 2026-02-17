/**
 * Mulberry32 - a simple, fast seeded PRNG.
 * Returns a function that produces floats in [0, 1) from a 32-bit seed.
 */
function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Creates a random number generator function.
 * If a seed is provided, returns a deterministic seeded PRNG.
 * Otherwise returns Math.random.
 */
export function createRandomFn(seed?: number): () => number {
  if (seed !== undefined) {
    return mulberry32(seed);
  }
  return Math.random;
}
