#!/bin/bash
# Prepares a Claude Code on the web session so `npm run build` produces the
# same sitemap it would produce anywhere else.
set -euo pipefail

# Local checkouts already have both of these; this is a remote-session fixup.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Deepen the clone BEFORE anything builds.
#
# scripts/git-lastmod.mjs walks `git log --name-only` to date each URL from the
# last commit touching its own source file. A shallow clone breaks that in a way
# that looks fine: git presents the boundary commit as though it added every
# file that existed at that point, so every page older than the cut-off inherits
# the boundary commit's date.
#
# Measured on a depth-52 clone of this repo: 22 of 84 URLs claimed 2026-07-30,
# the date of e41e41a — a commit that only pinned @astrojs/sitemap. With full
# history just 4 of them genuinely belong there; the other 18 move to their real
# dates (11 to 2026-07-12, 3 to 2026-07-23, 2 to 2026-07-09, and so on).
#
# The build reports "84/84 sitemap URLs have lastmod (100%)" either way, so
# nothing flags it. CLAUDE.md warns that a DROP in that number means a route's
# source path is uncovered — worth knowing that the reverse does not hold, and a
# clean 100% does not mean the dates are right.
#
# Already-complete clones exit non-zero here, which is fine.
git fetch --unshallow 2>/dev/null || true

npm install --no-audit --no-fund

# npm 10 rewrites package-lock.json on install, stripping the `libc` fields
# from optional platform packages — 102 lines of version noise here, not a
# dependency change. Left alone it makes the tree dirty from the first turn,
# and a later `git add -A` would sweep it into an unrelated commit. This runs
# before any work, so it cannot discard a real edit.
git checkout -- package-lock.json 2>/dev/null || true
