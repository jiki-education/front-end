# ESLint Implementation Plan

## Initial Status (After Auto-Fix)

- **Total Issues**: 645 (reduced from 1,212 after auto-fix)
- **Errors**: 210
- **Warnings**: 435

## Issues Breakdown

### Already Fixed by Auto-Fix (567 issues):

- ✅ `@typescript-eslint/consistent-type-imports` (239) - Added `import type`
- ✅ `curly` (133) - Added curly braces to control statements
- ✅ `@typescript-eslint/consistent-type-definitions` (76) - Changed `type` to `interface`
- ✅ `@typescript-eslint/no-unnecessary-type-assertion` (66) - Removed unnecessary assertions
- ✅ `@typescript-eslint/prefer-readonly` (27) - Added readonly modifiers
- ✅ `no-else-return` (26) - Removed unnecessary else blocks

### Remaining Issues to Fix:

#### Phase 1 - Quick Wins (COMPLETED)

- [x] **eqeqeq (135 issues)** - Changed all `==` to `===` and `!=` to `!==`
- [x] **no-console (28 issues)** - Removed console.log statements from source and tests

#### Phase 2 - Manual Review Required

- [ ] **@typescript-eslint/no-unused-vars (309 issues)** - Review and remove/prefix with \_
- [ ] **@typescript-eslint/no-unnecessary-condition (62 issues)** - Review logic
- [ ] **no-useless-escape (36 issues)** - Remove unnecessary escape characters

#### Phase 3 - Important Fixes

- [ ] **@typescript-eslint/no-floating-promises (15 issues)** - Add await or void
- [ ] **@typescript-eslint/naming-convention (22 issues)** - Fix naming or adjust config

#### Phase 4 - Config/Minor Issues

- [ ] **Parsing errors (2)** - Add to ESLint ignores or tsconfig
- [ ] **@typescript-eslint/method-signature-style (10)** - Style preference
- [ ] **no-undef (7)** - Fix undefined variables in JS files
- [ ] **Other minor issues** - Small fixes

## Progress Log

### 2025-01-25 - Initial Setup

- Copied ESLint config from ../fe
- Installed dependencies
- Added lint scripts to package.json
- Ran auto-fix (fixed 567 issues automatically)
- Created this plan

### 2025-01-25 - Phase 1 Fixes

- Fixed all eqeqeq issues (135) - replaced `==` with `===` and `!=` with `!==`
- Fixed all no-console issues (28) - removed console.log statements
- Added debug files to ESLint ignores
- **Reduced issues from 645 to 483** (162 issues fixed)

### 2025-01-25 - Phase 2 Implementation

- Fixed all ESLint errors (13 total):
  - Fixed import() type annotations
  - Added block scopes to switch cases with lexical declarations
  - Added comments to empty catch blocks
  - Fixed switch case fallthrough
  - Added default cases for exhaustiveness
- Began fixing warnings:
  - Removed unused imports
  - Prefixed unused parameters with underscore
  - Reduced warnings from 200+ to 173

### Current Status

- **Errors**: 0 ✅
- **Warnings**: 173 (down from 200+)
- Main remaining issues are unused variables that may be needed for future development

### Next Steps

1. Continue fixing @typescript-eslint/no-unused-vars warnings
2. Fix @typescript-eslint/no-unnecessary-condition warnings
3. Address any remaining style warnings
4. Consider which warnings should be kept for future development
