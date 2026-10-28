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
NGINX_CONF="$NGINX_DIR/user_conf.d/nginx-certbot117383.hostkey.in.conf"
BACKUP_DIR=/root/backups
LOG=/var/log/meinkun-deploy.log

export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS=--max-old-space-size=1280
export CI=1
export GIT_TERMINAL_PROMPT=0

exec >> >(tee -a "$LOG") 2>&1

if [[ "$(id -u)" -ne 0 ]]; then
  echo "This script must run as root or through sudo."
  exit 1
fi

cd "$APP_DIR"
test -f "$ENV_FILE"
test -f "$COMPOSE_FILE"

dc() {
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
}

echo
echo "============================================================"
date -Is
echo "meinkun deploy started"

echo "--- 1/8 database backup ---"
mkdir -p "$BACKUP_DIR"
if docker inspect meinkun-db >/dev/null 2>&1 && docker ps --format '{{.Names}}' | grep -qx meinkun-db; then
  env_value() {
    sed -n "s/^${1}=//p" "$ENV_FILE" | head -n 1 | tr -d '\r'
  }
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

echo "--- 2/8 fetch code ---"
if [[ "${SKIP_GIT_FETCH:-0}" == "1" ]]; then
  echo "git fetch skipped for an uploaded release bundle"
else
  git fetch --depth 10 origin main
  git reset --hard origin/main
  git log --oneline -1
fi

echo "--- 3/8 install provider Nginx site config ---"
install -d -m 0750 "$NGINX_DIR/user_conf.d"
if [[ -f "$NGINX_CONF" ]] && ! grep -q "proxy_pass http://meinkun-app:3000" "$NGINX_CONF"; then
  cp -a "$NGINX_CONF" "$NGINX_CONF.pre-meinkun.$(date +%Y%m%d-%H%M%S)"
fi
install -m 0644 deploy/nginx-meinkun.conf "$NGINX_CONF"
docker compose -f "$NGINX_DIR/docker-compose.yml" up -d --force-recreate nginx

echo "--- 4/8 start database and object storage ---"
dc up -d db minio
dc run --rm ops node scripts/init-storage.mjs

echo "--- 5/8 build application and operations images ---"
dc build --pull app ops

echo "--- 6/8 apply migrations ---"
dc run --rm ops npx prisma migrate deploy

echo "--- 7/8 restart application and seed admin ---"
dc up -d app
dc run --rm ops node scripts/seed-production.mjs

echo "--- 8/8 health checks ---"
for i in $(seq 1 30); do
  if curl -fsS --max-time 5 https://nginx-certbot117383.hostkey.in/ | grep -qi '<html'; then
    echo "public HTTPS health check ok (attempt $i)"
    break
  fi
  if [[ "$i" -eq 30 ]]; then
    echo "HEALTH CHECK FAILED"
    dc ps
    docker logs --tail 80 meinkun-app || true
    exit 1
  fi
  sleep 3
done

dc ps
docker compose -f "$NGINX_DIR/docker-compose.yml" ps
systemctl is-active docker

date -Is
echo "meinkun deploy finished OK"
