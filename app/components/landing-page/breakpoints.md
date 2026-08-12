# Landing page breakpoints

CSS custom properties cannot be used in `@media` conditions, so these values are written
literally in each module. This file is the single place that says what they mean; keep the
modules in step with it rather than inventing a nearby value.

| Value    | Name  | What changes there                                                      |
| -------- | ----- | ----------------------------------------------------------------------- |
| `640px`  | `sm`  | Phone → large phone. Type steps up; fixed-size visuals stop scaling.    |
| `768px`  | `md`  | Large phone → tablet. Single column becomes two; section padding grows. |
| `900px`  | `lg`  | Tablet → small laptop. Multi-column grids fill in; edge doodles return. |
| `1024px` | `xl`  | Small laptop → desktop. The hero goes side-by-side.                     |
| `1180px` | `2xl` | Desktop → wide. The walkthrough's side rails appear.                    |

## Rules

- **Mobile-first.** Prefer `@media (min-width: …)`, with the narrow case as the base rule.
  `max-width` is for the handful of places that genuinely subtract something on small screens
  (hiding a decorative doodle), not as the default direction.
- **Never pair `max-width: 768px` with `min-width: 768px`.** Both match at exactly 768px. The
  `max-width` partner of `md` is `767.98px`; the same applies at every step.
- **Fluid before breakpoints.** A `clamp()`, a `min()` or a container query that holds across
  the whole range beats a breakpoint that snaps. Breakpoints are for changes of _layout_, not
  for resizing something that could simply scale.
- **Decoration that overhangs gets clipped, content never does.** Ornaments hanging outside
  their own box (bursts, doodles, drifting emoji) must not be able to scroll the page: clip
  them on the section with `overflow-x: clip`. Anything carrying meaning is scaled down
  instead, so it stays readable.

## Scaling a fixed-size visual

Several visuals are drawn at a fixed natural size and scaled as one piece. The scale must be a
plain number, and in CSS the only way to compute one from a length is to divide by another
length — the divisor keeps its unit:

```css
/* correct: length ÷ length → number */
--scale: min(1, calc((100vw - 48px) / 1040px));

/* invalid: length ÷ number → length. The whole declaration is dropped and the element
   renders unscaled. */
--scale: min(1, calc((100vw - 48px) / 1040));
```

`transform: scale()` does not change layout size, so the element still reserves its unscaled
width. Either set the height from the same variable, or clip the overhang on the section.
