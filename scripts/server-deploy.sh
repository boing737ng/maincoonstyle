#!/usr/bin/env bash
# Production deploy for meinkun.
# Runs on the server as a privileged deployment user.
#
# Safety contract:
#   - PostgreSQL is backed up before code or container changes.
#   - only `prisma migrate deploy` is used; no reset, db push, or seed reset.
#   - .env.production is server-local and never touched by git.
#   - the provider-managed Certbot/Nginx stack is preserved and reused.

set -Eeuo pipefail

APP_DIR=/var/www/meinkun
COMPOSE_FILE="$APP_DIR/docker-compose.production.yml"
ENV_FILE="$APP_DIR/.env.production"
NGINX_DIR=/data/nginx
BACKUP_DIR=/root/backups
LOG=/var/log/meinkun-deploy.log

export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS=--max-old-space-size=1280
export CI=1
export GIT_TERMINAL_PROMPT=0

if [[ "$(id -u)" -ne 0 ]]; then
  exec sudo -n bash "$0" "$@"
fi
umask 077
exec >> >(tee -a "$LOG") 2>&1
exec 9>/var/lock/meinkun-deploy.lock
flock -n 9 || { echo "Another deployment is running"; exit 1; }

cd "$APP_DIR"
test -f "$ENV_FILE"
test -f "$COMPOSE_FILE"

RELEASE_SHA="${1:-}"
[[ "$RELEASE_SHA" =~ ^[0-9a-f]{40}$ ]] || { echo "A full release commit SHA is required"; exit 1; }
export MEINKUN_APP_IMAGE="meinkun-app:$RELEASE_SHA"
export MEINKUN_OPS_IMAGE="meinkun-ops:$RELEASE_SHA"
docker image inspect "$MEINKUN_APP_IMAGE" "$MEINKUN_OPS_IMAGE" >/dev/null

env_value() {
  sed -n "s/^${1}=//p" "$ENV_FILE" | head -n 1 | tr -d '\r' | sed 's/^"//; s/"$//'
}

SITE_URL="$(env_value NEXT_PUBLIC_SITE_URL)"
PUBLIC_HOSTNAME="${SITE_URL#*://}"
PUBLIC_HOSTNAME="${PUBLIC_HOSTNAME%%/*}"
if [[ "$SITE_URL" != "https://$PUBLIC_HOSTNAME" || ! "$PUBLIC_HOSTNAME" =~ ^[a-zA-Z0-9.-]+$ ]]; then
  echo "Could not determine hostname from NEXT_PUBLIC_SITE_URL"
  exit 1
fi
NGINX_CONF="$NGINX_DIR/user_conf.d/${PUBLIC_HOSTNAME}.conf"

dc() {
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
}

echo
echo "============================================================"
date -Is
echo "meinkun deploy started"
echo "release: $RELEASE_SHA"

echo "--- 1/8 database backup ---"
mkdir -p "$BACKUP_DIR"
if docker inspect meinkun-db >/dev/null 2>&1 && docker ps --format '{{.Names}}' | grep -qx meinkun-db; then
  POSTGRES_USER="$(env_value POSTGRES_USER)"
  POSTGRES_PASSWORD="$(env_value POSTGRES_PASSWORD)"
  POSTGRES_DB="$(env_value POSTGRES_DB)"
  BK="$BACKUP_DIR/meinkun-$(date +%Y%m%d-%H%M%S).sql.gz"
  docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" meinkun-db \
    pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" | gzip > "$BK"
  gunzip -t "$BK"
  echo "backup ok: $BK ($(stat -c%s "$BK") bytes)"
  ls -1t "$BACKUP_DIR"/meinkun-*.sql.gz | tail -n +11 | xargs -r rm -f
else
  echo "no existing database container; backup skipped"
fi

echo "--- 2/8 check out exact CI release ---"
git fetch --depth 20 origin main
git cat-file -e "$RELEASE_SHA^{commit}"
git merge-base --is-ancestor "$RELEASE_SHA" origin/main
git reset --hard "$RELEASE_SHA"

echo "--- 3/8 start database and object storage ---"
dc up -d db minio
dc run --rm ops node scripts/init-storage.mjs

echo "--- 4/8 apply migrations ---"
dc run --rm ops npx prisma migrate deploy

echo "--- 5/8 seed administrator without resetting existing password ---"
dc run --rm ops node scripts/seed-production.mjs

echo "--- 6/8 restart application ---"
dc up -d --wait --wait-timeout 180 app

echo "--- 7/8 install provider Nginx site config ---"
install -d -m 0750 "$NGINX_DIR/user_conf.d"
NGINX_BACKUP="$(mktemp)"
HAD_CONFIG=0
if [[ -f "$NGINX_CONF" ]]; then
  HAD_CONFIG=1
  cp -a "$NGINX_CONF" "$NGINX_BACKUP"
  cp -a "$NGINX_CONF" "$BACKUP_DIR/nginx-${PUBLIC_HOSTNAME}-$(date +%Y%m%d-%H%M%S).conf"
fi
sed "s/__MEINKUN_HOSTNAME__/${PUBLIC_HOSTNAME}/g" deploy/nginx-meinkun.conf > "$NGINX_CONF"
# Preserve the provider's default site when adding a second (custom) domain.
for other in "$NGINX_DIR"/user_conf.d/*.conf; do
  if [[ "$other" != "$NGINX_CONF" ]] && grep -q 'default_server' "$other"; then
    sed -i 's/ default_server reuseport//g' "$NGINX_CONF"
    break
  fi
done
chmod 0644 "$NGINX_CONF"
if ! docker compose -f "$NGINX_DIR/docker-compose.yml" exec -T nginx nginx -t; then
  if [[ "$HAD_CONFIG" == 1 ]]; then
    cp -a "$NGINX_BACKUP" "$NGINX_CONF"
  else
    rm -f "$NGINX_CONF"
  fi
  rm -f "$NGINX_BACKUP"
  echo "Invalid Nginx config restored; old running proxy was not reloaded"
  exit 1
fi
rm -f "$NGINX_BACKUP"
docker compose -f "$NGINX_DIR/docker-compose.yml" exec -T nginx nginx -s reload

echo "--- 8/8 health checks ---"
HEALTH_BODY="$(mktemp)"
for i in $(seq 1 30); do
  if curl -fsS --max-time 15 "$SITE_URL/" -o "$HEALTH_BODY" && grep -qi '<html' "$HEALTH_BODY"; then
    echo "public HTTPS health check ok (attempt $i)"
    break
  fi
  if [[ "$i" -eq 30 ]]; then
    echo "HEALTH CHECK FAILED"
    dc ps
    docker logs --tail 80 meinkun-app || true
    rm -f "$HEALTH_BODY"
    exit 1
  fi
  sleep 3
done
rm -f "$HEALTH_BODY"

dc ps
docker compose -f "$NGINX_DIR/docker-compose.yml" ps
systemctl is-active docker

printf '%s\n' "$RELEASE_SHA" > "$APP_DIR/.deployed-sha"
sed -i \
  -e "s|^MEINKUN_APP_IMAGE=.*|MEINKUN_APP_IMAGE=$MEINKUN_APP_IMAGE|" \
  -e "s|^MEINKUN_OPS_IMAGE=.*|MEINKUN_OPS_IMAGE=$MEINKUN_OPS_IMAGE|" \
  "$ENV_FILE"
date -Is
echo "meinkun deploy finished OK"
