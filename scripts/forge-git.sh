#!/usr/bin/env bash
# Commit / push le dépôt principal en incluant les fichiers des packages,
# tout en conservant leurs dépôts Git internes (temporairement déplacés).
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
STASH_DIR="$ROOT/.forge-nested-git"

hide_nested_gits() {
  mkdir -p "$STASH_DIR"
  local d name
  for d in packages/*/; do
    [ -e "${d}.git" ] || continue
    name="$(basename "$d")"
    if [ -e "$STASH_DIR/$name.git" ]; then
      echo "error: stash already contains $name.git — abort to avoid overwrite" >&2
      exit 1
    fi
    mv "${d}.git" "$STASH_DIR/$name.git"
  done
}

restore_nested_gits() {
  local stash name
  [ -d "$STASH_DIR" ] || return 0
  for stash in "$STASH_DIR"/*.git; do
    [ -e "$stash" ] || continue
    name="$(basename "$stash" .git)"
    mv "$stash" "packages/$name/.git"
  done
  rmdir "$STASH_DIR" 2>/dev/null || true
}

usage() {
  cat <<'EOF'
Usage:
  scripts/forge-git.sh add
  scripts/forge-git.sh commit -m "message"
  scripts/forge-git.sh push [remote] [branch]
  scripts/forge-git.sh commit-push -m "message" [remote] [branch]

Masque temporairement packages/*/.git pour que le dépôt parent
indexe les vrais fichiers (sauf les .git), puis les restaure.
EOF
}

cmd="${1:-}"
shift || true

case "$cmd" in
  add|commit|push|commit-push) ;;
  -h|--help|"")
    usage
    exit 0
    ;;
  *)
    echo "unknown command: $cmd" >&2
    usage
    exit 1
    ;;
esac

trap restore_nested_gits EXIT
hide_nested_gits

# Si d'anciens gitlinks (mode 160000) trainent, les retirer d'abord
while IFS= read -r path; do
  [ -n "$path" ] || continue
  git rm --cached -f -- "$path" >/dev/null 2>&1 || true
done < <(git ls-files -s | awk '$1 == "160000" { print $4 }')

git add -A

case "$cmd" in
  add)
    echo "Staged package files (nested .git dirs will be restored)."
    git status --short
    ;;
  commit)
    git commit "$@"
    ;;
  push)
    remote="${1:-origin}"
    branch="${2:-$(git rev-parse --abbrev-ref HEAD)}"
    git push -u "$remote" "$branch"
    ;;
  commit-push)
    # Extraire -m / message, le reste = remote branch optionnels
    msg=""
    remote="origin"
    branch="$(git rev-parse --abbrev-ref HEAD)"
    while [ $# -gt 0 ]; do
      case "$1" in
        -m)
          shift
          msg="${1:?missing commit message}"
          shift
          ;;
        *)
          remote="$1"
          shift
          if [ $# -gt 0 ]; then
            branch="$1"
            shift
          fi
          ;;
      esac
    done
    if [ -z "$msg" ]; then
      echo "error: commit-push requires -m \"message\"" >&2
      exit 1
    fi
    git commit -m "$msg"
    git push -u "$remote" "$branch"
    ;;
esac
