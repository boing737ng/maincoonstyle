#!/usr/bin/env bash
# Install independently as /usr/local/sbin/meinkun-ci.
# Use a forced command and "restrict" for the CI key in authorized_keys.
set -Eeuo pipefail
case "${SSH_ORIGINAL_COMMAND:-}" in
  pull\ *)
    sha="${SSH_ORIGINAL_COMMAND#pull }"
    [[ "$sha" =~ ^[0-9a-f]{40}$ ]] || exit 2
    IFS= read -r token
    [[ -n "$token" ]] || exit 2
    umask 077
    config="$(mktemp -d)"
    trap 'rm -rf -- "$config"' EXIT
    printf '%s' "$token" | docker --config "$config" login ghcr.io -u boing737ng --password-stdin
    unset token
    docker --config "$config" pull "ghcr.io/boing737ng/maincoonstyle:$sha"
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
    echo "This key only accepts CI registry pulls and deployments" >&2
    exit 2
    ;;
esac
