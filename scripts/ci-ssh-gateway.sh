#!/usr/bin/env bash
# Install independently as /usr/local/sbin/meinkun-ci.
# Use a forced command and "restrict" for the CI key in authorized_keys.
set -Eeuo pipefail
case "${SSH_ORIGINAL_COMMAND:-}" in
  pull\ *)
    sha="${SSH_ORIGINAL_COMMAND#pull }"
    [[ "$sha" =~ ^[0-9a-f]{40}$ ]] || exit 2
    IFS= read -r token
    IFS= read -r run_id
    [[ -n "$token" && "$run_id" =~ ^[0-9]+$ ]] || exit 2
    umask 077
    work="$(mktemp -d)"
    trap 'rm -rf -- "$work"; unset token' EXIT
    artifacts="$work/artifacts.json"
    curl --fail --silent --show-error \
      -H "Authorization: Bearer $token" \
      "https://api.github.com/repos/boing737ng/maincoonstyle/actions/runs/$run_id/artifacts?name=meinkun-image-$sha&per_page=1" \
      -o "$artifacts"
    artifact_id="$(python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); print(d["artifacts"][0]["id"])' "$artifacts")"
    curl --fail --silent --show-error --location \
      -H "Authorization: Bearer $token" \
      "https://api.github.com/repos/boing737ng/maincoonstyle/actions/artifacts/$artifact_id/zip" \
      -o "$work/artifact.zip"
    unzip -p "$work/artifact.zip" meinkun-image.tar.gz | docker image load
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
    echo "This key only accepts CI artifact downloads and deployments" >&2
    exit 2
    ;;
esac
