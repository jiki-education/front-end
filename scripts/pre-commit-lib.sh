#!/bin/sh
# Shared helpers for the pre-commit hooks.
#
# Why this exists
# ---------------
# Git exports GIT_DIR (and GIT_INDEX_FILE) when it runs a hook, but it does NOT
# export GIT_WORK_TREE. In the main checkout GIT_DIR is left unset, so git
# rediscovers the repo from the current directory and everything behaves as you
# would expect. In a *linked worktree* GIT_DIR is set, and the moment a script
# does `cd app` git treats the current directory as the top of the work tree:
#
#     $ cd app && git rev-parse --show-toplevel   # <worktree>/app   (!)
#     $ cd app && git rev-parse --show-prefix     # <empty>          (!)
#
# That silently reinterprets every relative pathspec as repo-root-relative, so
# `git add app/test/network/page.tsx` (meant as app-relative) wrote a bogus
# root-relative entry into the index. The bogus entry was then picked up by the
# next `git diff --cached`, which handed eslint a path that does not exist, and
# the hook aborted leaving the polluted index behind.
#
# The rules these helpers enforce so that cannot happen again:
#
#   1. The repo root is derived structurally from the script's own location,
#      never from git's idea of the current directory.
#   2. Paths are kept repo-relative, exactly as `git diff --cached` emits them.
#      Nothing is ever prefix-stripped, so nothing can be mis-stripped. Tools
#      are handed absolute paths built as "$PC_REPO_ROOT/$path".
#   3. Every git command runs as `git -C "$PC_REPO_ROOT"`, so pathspecs resolve
#      against the real repo root in a main checkout and a linked worktree
#      alike.
#   4. The whole run is one transaction. Formatters and --fix passes rewrite
#      the working tree, but nothing is staged until every check in every
#      package has passed. If anything fails, the rewrites are undone and the
#      index is never touched, so the commit aborts with the repository exactly
#      as the hook found it.
#
# There are two entry points. `.husky/pre-commit` calls pc_session_begin /
# pc_session_commit to wrap the whole multi-package run in one transaction.
# A package script calls pc_init, and either joins the session already in
# progress or (when run standalone) opens one of its own.

# ---------------------------------------------------------------------------
# Session: the unit of atomicity.
# ---------------------------------------------------------------------------

# pc_session_begin <repo-root>
pc_session_begin() {
  PC_REPO_ROOT="$1"
  PC_SESSION="$(mktemp -d "${TMPDIR:-/tmp}/jiki-pre-commit.XXXXXX")" || return 1
  export PC_SESSION
  mkdir -p "$PC_SESSION/snapshot"
  : > "$PC_SESSION/to-stage"
  PC_OWNS_SESSION=1
  PC_DONE=0
  trap 'pc_session_cleanup' EXIT
  trap 'exit 1' INT TERM
}

# pc_session_commit: every check passed, so stage the rewrites and disarm the
# restore-on-exit trap.
pc_session_commit() {
  pc_stage_pending || return 1
  PC_DONE=1
  return 0
}

pc_session_cleanup() {
  if [ "${PC_DONE:-0}" != "1" ]; then
    pc_restore
  fi
  if [ -n "${PC_SESSION:-}" ]; then
    rm -rf "$PC_SESSION"
  fi
  return 0
}

# ---------------------------------------------------------------------------
# pc_init <package-dir>
#
# <package-dir> is the absolute path to the package (e.g. /path/to/repo/app).
# Sets PC_PKG_DIR, PC_REPO_ROOT, PC_PKG_PREFIX (e.g. "app/") and PC_TMP.
# ---------------------------------------------------------------------------
pc_init() {
  PC_PKG_DIR="$1"
  PC_REPO_ROOT="$(cd "$PC_PKG_DIR/.." && pwd)"
  PC_PKG_PREFIX="$(basename "$PC_PKG_DIR")/"

  PC_TMP="$(mktemp -d "${TMPDIR:-/tmp}/jiki-pre-commit-pkg.XXXXXX")" || return 1

  if [ -n "${PC_SESSION:-}" ] && [ -d "$PC_SESSION" ]; then
    # A parent hook owns the transaction; it will stage or restore for us.
    PC_OWNS_SESSION=0
    trap 'rm -rf "$PC_TMP"' EXIT
  else
    PC_SESSION="$PC_TMP/session"
    mkdir -p "$PC_SESSION/snapshot"
    : > "$PC_SESSION/to-stage"
    PC_OWNS_SESSION=1
    PC_DONE=0
    trap 'pc_pkg_cleanup' EXIT
    trap 'exit 1' INT TERM
  fi
  return 0
}

pc_pkg_cleanup() {
  if [ "${PC_DONE:-0}" != "1" ]; then
    pc_restore
  fi
  rm -rf "$PC_TMP"
  return 0
}

# pc_finish: called by a package once its own checks pass. When the package
# owns the transaction it stages now; otherwise the parent hook does it after
# every package has passed.
pc_finish() {
  if [ "${PC_OWNS_SESSION:-0}" = "1" ]; then
    pc_stage_pending || return 1
    PC_DONE=1
  fi
  return 0
}

# pc_fail <message>: report and abort. The EXIT trap undoes any rewrites.
pc_fail() {
  echo "$1"
  exit 1
}

# ---------------------------------------------------------------------------
# Staged-file discovery
# ---------------------------------------------------------------------------

# pc_staged_files <extension-regex>
#
# Prints the repo-relative paths of staged files inside this package that match
# the regex, one per line. Paths are exactly as git records them, so
# app/app/foo.tsx stays app/app/foo.tsx.
pc_staged_files() {
  git -C "$PC_REPO_ROOT" diff --cached --name-only --diff-filter=ACMR -z -- "$PC_PKG_PREFIX" |
    tr '\0' '\n' |
    grep -E "$1" || true
}

# ---------------------------------------------------------------------------
# The transaction
# ---------------------------------------------------------------------------

# pc_snapshot <file-of-repo-relative-paths>
#
# Records the current contents of every listed file, and registers it as
# something to stage if (and only if) the whole run succeeds.
pc_snapshot() {
  while IFS= read -r rel; do
    [ -n "$rel" ] || continue
    src="$PC_REPO_ROOT/$rel"
    [ -f "$src" ] || continue
    dest="$PC_SESSION/snapshot/$rel"
    # Never re-snapshot: the first copy is the only pristine one.
    if [ -f "$dest" ]; then
      continue
    fi
    mkdir -p "$(dirname "$dest")"
    cp -p "$src" "$dest"
    printf '%s\n' "$rel" >> "$PC_SESSION/to-stage"
  done < "$1"
}

# pc_abs_list <file-of-repo-relative-paths> <output-file>
#
# Writes a NUL-delimited list of absolute paths for `xargs -0`, so paths
# containing spaces survive.
pc_abs_list() {
  : > "$2"
  while IFS= read -r rel; do
    [ -n "$rel" ] || continue
    printf '%s/%s\0' "$PC_REPO_ROOT" "$rel" >> "$2"
  done < "$1"
}

# pc_run_on <file-of-repo-relative-paths> <command...>
#
# Runs the command over the absolute paths. Non-zero if any invocation was.
pc_run_on() {
  list="$1"
  shift
  pc_abs_list "$list" "$PC_TMP/args"
  xargs -0 "$@" < "$PC_TMP/args"
}

# pc_restore: put every snapshotted file back exactly as it was found. Only
# files a fixer actually rewrote are written, so mtimes are otherwise left be.
pc_restore() {
  if [ -z "${PC_SESSION:-}" ] || [ ! -f "$PC_SESSION/to-stage" ]; then
    return 0
  fi
  while IFS= read -r rel; do
    [ -n "$rel" ] || continue
    snap="$PC_SESSION/snapshot/$rel"
    live="$PC_REPO_ROOT/$rel"
    [ -f "$snap" ] || continue
    if [ ! -f "$live" ] || ! cmp -s "$snap" "$live"; then
      cp -p "$snap" "$live"
    fi
  done < "$PC_SESSION/to-stage"
  return 0
}

# pc_stage_pending: stage the files a fixer rewrote, using repo-relative paths
# resolved against the repo root.
pc_stage_pending() {
  if [ -z "${PC_SESSION:-}" ] || [ ! -s "$PC_SESSION/to-stage" ]; then
    return 0
  fi
  to_add="$PC_SESSION/to-add"
  : > "$to_add"
  while IFS= read -r rel; do
    [ -n "$rel" ] || continue
    snap="$PC_SESSION/snapshot/$rel"
    live="$PC_REPO_ROOT/$rel"
    if [ -f "$live" ] && { [ ! -f "$snap" ] || ! cmp -s "$snap" "$live"; }; then
      printf '%s\0' "$rel" >> "$to_add"
    fi
  done < "$PC_SESSION/to-stage"
  if [ -s "$to_add" ]; then
    xargs -0 git -C "$PC_REPO_ROOT" add -- < "$to_add" || return 1
  fi
  return 0
}
