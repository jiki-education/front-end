---
description: Audit exercise and project icons — find missing, misnamed, and orphaned icon files
---

# Audit Icons

Compare all exercise and project slugs from `README.md` with the icon SVG files stored in `../app/icons/exercises/` and `../app/icons/projects/`.

## How Icon Loading Works

The app loads icons dynamically by slug:

- **Exercises**: `ExerciseIcon` component loads `app/icons/exercises/${slug}.svg` (falls back to `fallback.svg`)
- **Projects**: `ProjectIcon` component loads `app/icons/projects/${slug}.svg` (falls back to `fallback.svg`)

This means the icon filename **must exactly match** the exercise/project slug from the curriculum.

## Steps

### Step 1: Extract slugs from README

Parse `README.md` to extract all exercise and project slugs. The README contains a JSON structure with entries like:

```json
{ "type": "exercise", "slug": "maze-solve-basic" }
{ "type": "project", "slug": "structured-house" }
```

Separate exercises from projects. Ignore video entries.

### Step 2: List icon files

List all `.svg` files in:

- `../app/icons/exercises/` (excluding `fallback.svg`)
- `../app/icons/projects/` (excluding `fallback.svg`)

### Step 3: List curriculum exercise directories

List all directories in `src/exercises/` to identify exercises that exist in code but aren't in the README yet.

### Step 4: Cross-reference and report

Run this Python script (adjust paths as needed based on the working directory):

```bash
python3 << 'PYEOF'
import os, re

CURRICULUM_DIR = os.path.dirname(os.path.abspath("README.md"))
APP_ICONS_DIR = os.path.join(CURRICULUM_DIR, "..", "app", "icons")

# Parse README
with open("README.md") as f:
    content = f.read()

entries = re.findall(r'"type":\s*"(\w+)",\s*"slug":\s*"([^"]+)"', content)
readme_exercises = sorted(set(slug for t, slug in entries if t == "exercise"))
readme_projects = sorted(set(slug for t, slug in entries if t == "project"))

# List icon files
exercise_icons = set(
    f[:-4]
    for f in os.listdir(os.path.join(APP_ICONS_DIR, "exercises"))
    if f.endswith(".svg") and f != "fallback.svg"
)
project_icons = set(
    f[:-4]
    for f in os.listdir(os.path.join(APP_ICONS_DIR, "projects"))
    if f.endswith(".svg") and f != "fallback.svg"
)

# List curriculum exercise directories
curriculum_dirs = set(
    d
    for d in os.listdir("src/exercises")
    if os.path.isdir(os.path.join("src/exercises", d))
)

all_readme_slugs = set(readme_exercises) | set(readme_projects)

# === Report ===

print("=" * 65)
print("EXERCISES: Missing icons (in README, no matching .svg)")
print("=" * 65)
missing_ex = []
for slug in readme_exercises:
    if slug not in exercise_icons:
        close = [
            i
            for i in exercise_icons
            if slug.endswith(i) or i.endswith(slug) or slug in i or i in slug
        ]
        suffix = f"  -->  possible match: {close}" if close else "  -->  NO MATCH"
        print(f"  {slug}{suffix}")
        missing_ex.append(slug)

print()
print("=" * 65)
print("PROJECTS: Missing icons (in README, no matching .svg in projects/)")
print("=" * 65)
missing_proj = []
for slug in readme_projects:
    if slug not in project_icons:
        in_exercises = slug in exercise_icons
        if in_exercises:
            print(f"  {slug}  -->  found in exercises/ not projects/")
        else:
            print(f"  {slug}  -->  NO MATCH anywhere")
        missing_proj.append(slug)

print()
print("=" * 65)
print("In curriculum code but NOT in README (may need icons later)")
print("=" * 65)
in_code_not_readme = curriculum_dirs - all_readme_slugs
for s in sorted(in_code_not_readme):
    has_icon = "(has icon)" if s in exercise_icons else "(no icon)"
    print(f"  {s}  {has_icon}")

print()
print("=" * 65)
print("ORPHANED exercise icons (no matching curriculum exercise at all)")
print("=" * 65)
orphaned = sorted(exercise_icons - curriculum_dirs - {"fallback"})
for icon in orphaned:
    print(f"  {icon}.svg")

print()
print("=" * 65)
print("SUMMARY")
print("=" * 65)
print(f"  README exercises: {len(readme_exercises)}")
print(f"  README projects:  {len(readme_projects)}")
print(f"  Exercise icons:   {len(exercise_icons)}")
print(f"  Project icons:    {len(project_icons)}")
print()
print(f"  Missing exercise icons: {len(missing_ex)}")
print(f"  Missing project icons:  {len(missing_proj)}")
print(f"  Orphaned icons (no exercise in codebase): {len(orphaned)}")
print(f"  Curriculum exercises not in README: {len(in_code_not_readme)}")
PYEOF
```

## Output Format

Present the script output to the user, then provide a summary with recommended actions:

1. **Rename/copy mismatches** — Icons that exist but with a different name than the exercise slug
2. **Fix project icons** — Project icons that are in `exercises/` instead of `projects/`
3. **Truly missing** — Exercises with no icon and no close match (need new artwork)
4. **Orphaned icons to delete** — Icons with no matching exercise anywhere in the codebase
