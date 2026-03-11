---
description: Process an SVG icon for use as a lesson icon — optimize, remove grey background, make circle fill the space
---

# Tidy SVG Icon

Process the provided SVG file for use as a lesson icon in `images/lesson-icons/`.

**Input**: $ARGUMENTS (path to an SVG file)

## Steps

1. **Determine the exercise slug**:
   - Ask the user which exercise this icon is for.
   - Look up the exact slug by checking exercise folders in `src/exercises/` and cross-referencing with `README.md`.
   - Confirm the slug with the user before proceeding (e.g., "This will be saved as `images/lesson-icons/<slug>.svg` — correct?").
   - The output file will be `images/lesson-icons/<slug>.svg`.

2. **Optimize with svgo**:

   ```bash
   svgo "<input-svg>" -o "images/lesson-icons/<slug>.svg"
   ```

3. **Identify and fix fills**:
   - List all `fill` colours: `grep -o 'fill="[^"]*"' <file> | sort | uniq -c | sort -rn`
   - The SVG will have a background fill (often `#e7ecee`, `#e4f1f8`, or similar) that covers the area outside the blue circle.
   - If the background colour is shared with visible elements (e.g., a snowman body), change it to white (`#ffffff`) instead of `none`. The clipPath in the next step will handle removing the background.
   - If the background colour is NOT shared with any visible elements, replace it with `fill="none"`.

4. **Add a clipPath to the blue circle boundary**:
   This is the correct approach for removing the background. Rather than trying to edit individual paths, clip everything to the blue circle:
   - Find the blue circle's bounding box by extracting just the blue circle path (`#bde9fb`, `#bae8f8`, `#bbe8f8`, or similar light blue) into a temp SVG and measuring with ImageMagick:
     ```bash
     magick -background none /tmp/blue-circle-only.svg -trim -format "size: %wx%h offset: +%X+%Y" info:
     ```
   - Calculate the circle center and radius from the bounding box: `cx = offsetX + width/2`, `cy = offsetY + height/2`, `r = width/2`.
   - Insert a `<defs><clipPath>` with a `<circle>` element, and wrap all existing content in a `<g clip-path="url(#c)">`:
     ```xml
     <defs><clipPath id="c"><circle cx="..." cy="..." r="..."/></clipPath></defs>
     <g clip-path="url(#c)">
       ...all existing paths...
     </g>
     ```

5. **Set dimensions**: Change `width` and `height` attributes to `80`.

6. **Adjust viewBox so the circle fills the space**:
   - Read the current viewBox dimensions.
   - Use ImageMagick to find the trimmed content bounds at native resolution:
     ```bash
     magick -background none "<file>" -resize "<vbW>x<vbH>!" -trim -format "%wx%h offset:%O" info:
     ```
   - Calculate a square viewBox that tightly fits the content, centering on the shorter axis.
   - Update the `viewBox` attribute accordingly.

7. **Render a preview** to verify:

   ```bash
   magick -background none "<file>" -resize 160x160 /tmp/<slug>-preview.png
   ```

   Show the preview to the user.

8. **Confirm** the result looks correct:
   - Transparent background (no grey or white rectangle outside the circle)
   - Blue circle fills the full icon space (no padding)
   - Content is centered and not clipped incorrectly
   - All visible elements have correct fills
