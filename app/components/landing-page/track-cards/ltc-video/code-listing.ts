// The program on screen and its syntax colouring, as data so the edited line renders in three pieces.

const KEYWORDS = ["repeat_until_game_over", "set", "to", "if", "do", "else", "end", "change"];
const FUNCS = ["is_alien_above", "move_right", "move_left", "shoot"];

/** `null` is the edited line, composed at render time from the current edit state. */
export const CODE: (string | null)[] = [
  "set position to 1",
  "repeat_until_game_over do",
  "  if is_alien_above() do",
  "    shoot()",
  "  end",
  null,
  "    move_right()",
  "    change position to position + 1",
  "  else do",
  "    move_left()",
  "  end",
  "end"
];

/** Index of the line carrying the boundary bug. */
export const EDIT_LINE = 5;

/** The wrong boundary, and the right one. */
export const BAD = "20";
export const GOOD = "11";

const EDIT_PREFIX = "  if position < ";
const EDIT_SUFFIX = " do";

export interface Token {
  text: string;
  kind: "kw" | "fn" | "nm" | "plain";
}

/** Split a line into coloured tokens so React can render spans. */
export function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  // One pass over words, numbers and the gaps between, so a name before `(` reads as a function call.
  const pattern = /([a-z_]+)(\()|\b(\d+)\b|([a-z_]+)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > last) {
      tokens.push({ text: line.slice(last, match.index), kind: "plain" });
    }

    // Indexed rather than destructured: only one alternative matches at a time, so the others are absent.
    const fnName = match[1] as string | undefined;
    const num = match[3] as string | undefined;
    const word = match[4] as string | undefined;

    if (fnName !== undefined) {
      tokens.push({ text: fnName, kind: FUNCS.includes(fnName) ? "fn" : "plain" });
      tokens.push({ text: "(", kind: "plain" });
    } else if (num !== undefined) {
      tokens.push({ text: num, kind: "nm" });
    } else if (word !== undefined) {
      tokens.push({ text: word, kind: KEYWORDS.includes(word) ? "kw" : "plain" });
    }

    last = pattern.lastIndex;
  }

  if (last < line.length) tokens.push({ text: line.slice(last), kind: "plain" });
  return tokens;
}

/** The listing, tokenised once at module load; only the edited line (marked `null`) varies per keystroke. */
export const CODE_TOKENS: (Token[] | null)[] = CODE.map((line) => (line === null ? null : tokenize(line)));

/** The static halves of the edited line, either side of the value being typed. */
export const EDIT_PREFIX_TOKENS = tokenize(EDIT_PREFIX);
export const EDIT_SUFFIX_TOKENS = tokenize(EDIT_SUFFIX);
