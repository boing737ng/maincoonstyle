#!/usr/bin/env bash
# Install independently as /usr/local/sbin/meinkun-ci.
# Use a forced command and "restrict" for the CI key in authorized_keys.
set -Eeuo pipefail
case "${SSH_ORIGINAL_COMMAND:-}" in
  load)
    gzip -dc | docker image load
    ;;
  deploy\ *)
    sha="${SSH_ORIGINAL_COMMAND#deploy }"
    [[ "$sha" =~ ^[0-9a-f]{40}$ ]] || exit 2
    cd /var/www/meinkun
    export GIT_TERMINAL_PROMPT=0
    git fetch --depth 20 origin main
    git merge-base --is-ancestor "$sha" origin/main
    script="$(mktemp)"
    trap 'rm -f "$script"' EXIT
    git show "$sha:scripts/server-deploy.sh" > "$script"
    bash "$script" "$sha"
    ;;
  *)
    echo "This key only accepts CI image uploads and deployments" >&2
    exit 2
    ;;
esac
