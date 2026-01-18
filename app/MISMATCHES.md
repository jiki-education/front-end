# API Sync Issues

Issues identified between frontend types and backend serializers/controllers.

---

## Outstanding Issues

### 1. ConceptListItem Type

**Files:** `types/concepts.ts` vs `serialize_concepts.rb`

FE has `iconSrc?: string` but BE doesn't return this field.

---

### 2. Projects API Stub Functions

**File:** `lib/api/projects.ts`

These functions are stubs with console.log only:

- `startProject()` - Has TODO comment saying "Backend doesn't have explicit start endpoint yet"
- `markProjectComplete()` - Has TODO comment saying "Backend doesn't have explicit complete endpoint yet"

---

### 3. Project show endpoint

**Files:** `lib/api/projects.ts` vs `serialize_project.rb`

`fetchProject()` expects `status` and `exercise_slug` fields but `SerializeProject` only returns `slug`, `title`, `description` (no status or exercise_slug).

---

## Aligned (No Issues)

- **User API** - ✅ Aligned
- **Subscription API** - ✅ Aligned
- **Lessons API** - ✅ Aligned
- **User Lessons API** - ✅ Aligned
- **Levels API** - ✅ Aligned
- **Badges API** - ✅ Aligned
- **Settings API** - ✅ Aligned
