/**
 * PostCSS plugin: rewrite physical `margin`/`padding` SHORTHANDS into two-axis
 * logical form (`*-block` + `*-inline`) at build time.
 *
 * We keep authoring the readable physical shorthand in source (e.g.
 * `padding: 0 16px 0 12px`), but the physical 4-value order (top right bottom
 * left) does NOT respond to `dir`, so an asymmetric left/right shorthand would
 * be RTL-unsafe. This plugin reshuffles the shorthand into logical output so the
 * browser mirrors it under `dir=rtl`.
 *
 * Only the bare shorthands `margin` and `padding` are touched — never
 * `margin-top`, `margin-inline`, or any other property — so already-logical
 * props and unrelated shorthands (border, inset, gap, ...) are left alone and a
 * second pass is a no-op.
 *
 * Must be a module referenced by string in postcss.config.mjs — Next.js rejects
 * inline plugin objects ("Malformed PostCSS Configuration").
 */
/* eslint-disable @typescript-eslint/no-require-imports --
   Must be CommonJS: Next.js loads postcss plugins via require(), which cannot
   load an ESM module, so this file uses require() by necessity. */

// Split a CSS value into top-level tokens, respecting parentheses so the spaces
// inside calc()/var()/min()/max()/clamp() do not create extra tokens.
function tokenize(value) {
  const tokens = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "(") {
      depth++;
      current += ch;
    } else if (ch === ")") {
      depth--;
      current += ch;
    } else if (depth === 0 && /\s/.test(ch)) {
      if (current !== "") {
        tokens.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }
  if (current !== "") tokens.push(current);
  return tokens;
}

// Map the 1-4 physical shorthand tokens onto { block, inline } logical values.
// CSS shorthand order = top right bottom left; block = top/bottom, inline is
// written `start end` = left right in LTR (so 4-value inline is LEFT then RIGHT).
function toLogical(tokens) {
  switch (tokens.length) {
    case 1:
      return { block: tokens[0], inline: tokens[0] };
    case 2:
      return { block: tokens[0], inline: tokens[1] };
    case 3:
      return { block: `${tokens[0]} ${tokens[2]}`, inline: tokens[1] };
    case 4:
      // inline = left then right = D B
      return { block: `${tokens[0]} ${tokens[2]}`, inline: `${tokens[3]} ${tokens[1]}` };
    default:
      return null;
  }
}

const plugin = () => ({
  postcssPlugin: "shorthand-physical-to-logical",
  Declaration(decl) {
    if (decl.prop !== "margin" && decl.prop !== "padding") return;

    // Strip and remember `!important` so it can be re-applied to both outputs.
    let value = decl.value.trim();
    const important = decl.important;

    const tokens = tokenize(value);
    const logical = toLogical(tokens);
    if (!logical) return;

    const blockDecl = decl.clone({
      prop: `${decl.prop}-block`,
      value: logical.block,
      important
    });
    const inlineDecl = decl.clone({
      prop: `${decl.prop}-inline`,
      value: logical.inline,
      important
    });

    decl.before(blockDecl);
    decl.before(inlineDecl);
    decl.remove();
  }
});
plugin.postcss = true;

module.exports = plugin;
