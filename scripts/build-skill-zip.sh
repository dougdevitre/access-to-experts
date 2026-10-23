#!/usr/bin/env bash
# Build dist/<skill-name>.zip, the file people upload to claude.ai
# (Customize > Skills > + > Create skill > Upload a skill).
#
# claude.ai rejects an upload when the skill folder name doesn't match the
# skill name, so the zip holds exactly one top-level folder named after the
# `name:` in SKILL.md, with only the files the skill reads at runtime.
#
# Safe to re-run: it rebuilds the zip from scratch every time, and the same
# commit always gives a byte-identical zip (sorted entries, fixed mtimes and
# modes, no extra file attributes).
#
# The skill lives in skill/ (SKILL.md), not at the repo root, so the zip is
# built from that folder: skill/ is copied to a temp dir, the repo's
# DISCLAIMER.md and LICENSE are added, and that folder is zipped.
#
# SKILL.md tells Claude to validate playbooks against
# schemas/playbook.schema.json, so the zip ships a copy of it at
# skill/schemas/playbook.schema.json. The repo-root schemas/ copy stays the
# canonical one; the build fails if the two differ (see SYNCED below).
#
# Usage: scripts/build-skill-zip.sh
# Exits 1 if the frontmatter fails validation, a required file is missing,
# a SYNCED copy differs from its canonical file, or a path SKILL.md names
# under LINKED_DIRS is not in the zip.
set -euo pipefail

# The skill folder, and the repo-root files added to it.
SKILL_DIR="skill"
FROM_REPO=(DISCLAIMER.md LICENSE)
# What goes into the zip (taken from the skill folder when present).
INCLUDE=(SKILL.md DISCLAIMER.md LICENSE schemas/playbook.schema.json)
# Files that must be present.
REQUIRED=(SKILL.md DISCLAIMER.md LICENSE schemas/playbook.schema.json)
# Copies in the skill folder that must stay byte-identical to a canonical
# repo file, as "canonical:copy" pairs. To change one, edit the canonical
# file and copy it over.
SYNCED=(schemas/playbook.schema.json:skill/schemas/playbook.schema.json)
# Folders whose paths, when SKILL.md names them, must be in the zip. None yet:
# most paths SKILL.md names (schemas/*.schema.json, docs/, packages/...) are its
# "repo file map" for people working in a clone, not files the skill ships; the
# one schema it ships is in REQUIRED. Add a folder here when every path SKILL.md
# names under it is in skill/.
LINKED_DIRS=()
# Fixed timestamp for every entry, so rebuilds are reproducible.
FIXED_TIME="2026-01-01 00:00:00"

die() { echo "build-skill-zip: error: $*" >&2; exit 1; }

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"
validator="$root/.github/scripts/check-skill-frontmatter.py"

for tool in zip unzip python3; do
  command -v "$tool" >/dev/null || die "$tool is not installed"
done
[ -f "$validator" ] || die "$validator is missing"
[ -f "$SKILL_DIR/SKILL.md" ] || die "$SKILL_DIR/SKILL.md is missing"
for f in "${FROM_REPO[@]}"; do
  [ -f "$f" ] || die "$f is missing"
done
for pair in "${SYNCED[@]}"; do
  canonical="${pair%%:*}"
  copy="${pair#*:}"
  [ -f "$canonical" ] || die "$canonical is missing"
  [ -f "$copy" ] || die "$copy is missing; copy it from $canonical"
  cmp -s "$canonical" "$copy" ||
    die "$copy differs from $canonical; edit $canonical, then copy it over: cp $canonical $copy"
done

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# 0. Work from a copy of the skill folder with the repo-root files added.
mkdir -p "$tmp/src"
cp -R "$SKILL_DIR/." "$tmp/src/"
for f in "${FROM_REPO[@]}"; do
  cp "$f" "$tmp/src/$f"
done
cd "$tmp/src"
for f in "${REQUIRED[@]}"; do
  [ -f "$f" ] || die "$f is missing"
done

# 1. Validate the frontmatter and read the skill name.
python3 -I "$validator" SKILL.md || die "SKILL.md frontmatter failed validation"
name="$(python3 -I - SKILL.md <<'PY'
import re, sys, yaml
text = open(sys.argv[1], encoding="utf-8").read()
m = re.match(r"---\r?\n(.*?)\r?\n---\r?\n", text, re.S)
print((yaml.safe_load(m.group(1)) or {}).get("name", "") if m else "")
PY
)"
[[ "$name" =~ ^[a-z0-9-]+$ ]] || die "could not read a valid skill name from SKILL.md"

stage="$tmp/stage/$name"
mkdir -p "$stage"

# 2. Stage a copy of the runtime files: no dotfiles, no PDFs, no symlinks.
for item in "${INCLUDE[@]}"; do
  [ -e "$item" ] || continue
  if [ -L "$item" ]; then die "$item is a symlink; the zip only takes regular files"; fi
  if [ -f "$item" ]; then
    mkdir -p "$stage/$(dirname "$item")"
    cp "$item" "$stage/$item"
    continue
  fi
  while IFS= read -r -d '' path; do
    [ -L "$path" ] && die "$path is a symlink; the zip only takes regular files"
    mkdir -p "$stage/$(dirname "$path")"
    cp "$path" "$stage/$path"
  done < <(find "$item" -name '.*' -prune -o ! -iname '*.pdf' \( -type f -o -type l \) -print0)
done

# 3. Normalize modes and mtimes, then zip in sorted order.
find "$tmp/stage" -type d -exec chmod 755 {} +
find "$tmp/stage" -type f -exec chmod 644 {} +
find "$tmp/stage" -exec env TZ=UTC touch -h -d "$FIXED_TIME" {} +
(
  cd "$tmp/stage"
  find "$name" -print | LC_ALL=C sort | TZ=UTC zip -X -q -@ "$tmp/$name.zip"
)
mkdir -p "$root/dist"
rm -f "$root/dist/$name.zip"
mv "$tmp/$name.zip" "$root/dist/$name.zip"
zipfile="$root/dist/$name.zip"

# 4. Check the zip itself, the way claude.ai will see it.
check="$tmp/check"
mkdir -p "$check"
unzip -q "$zipfile" -d "$check"
entries="$(unzip -Z1 "$zipfile")"

top="$(printf '%s\n' "$entries" | cut -d/ -f1 | sort -u)"
[ "$top" = "$name" ] || die "zip must hold one top-level folder named $name, found: $(echo $top)"

python3 -I "$validator" "$check/$top/SKILL.md" "$top" || die "the zipped SKILL.md failed validation"

for f in "${REQUIRED[@]}"; do
  [ -f "$check/$name/$f" ] || die "$f is missing from the zip"
done

if printf '%s\n' "$entries" | grep -E '(^|/)\.|(^|/)dist/|\.pdf$' >/dev/null; then
  die "zip contains files it must not: $(printf '%s\n' "$entries" | grep -E '(^|/)\.|(^|/)dist/|\.pdf$' | tr '\n' ' ')"
fi

missing=0
if [ "${#LINKED_DIRS[@]}" -gt 0 ]; then
dirs_re="$(IFS='|'; echo "${LINKED_DIRS[*]}")"
while IFS= read -r ref; do
  [ -n "$ref" ] || continue
  ref="${ref%.}"
  if [[ "$ref" == */ ]]; then
    if [ -z "$(find "$check/$name/$ref" -type f 2>/dev/null | head -1)" ]; then
      echo "build-skill-zip: SKILL.md names $ref, but the zip has no files under it" >&2
      missing=1
    fi
  elif [ ! -f "$check/$name/$ref" ]; then
    echo "build-skill-zip: SKILL.md names $ref, but it is not in the zip" >&2
    missing=1
  fi
done < <(grep -oE "(^|[^A-Za-z0-9_./-])(\./)?($dirs_re)/[A-Za-z0-9._/-]*" SKILL.md \
           | sed -E "s#^[^A-Za-z0-9]*(\./)?##" | LC_ALL=C sort -u)
fi
[ "$missing" -eq 0 ] || die "files named in SKILL.md are missing from the zip"

# 5. Report.
bytes="$(wc -c < "$zipfile" | tr -d ' ')"
sha="$(sha256sum "$zipfile" | cut -d' ' -f1)"
echo "Built $zipfile ($bytes bytes, sha256 $sha)"
echo "Files ($(printf '%s\n' "$entries" | grep -cv '/$')):"
printf '%s\n' "$entries" | grep -v '/$' | sed 's/^/  /'
