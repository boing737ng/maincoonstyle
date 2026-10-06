#!/bin/bash
# meinkun production deploy. Runs ON THE SERVER as root.
# Invoked by GitHub Actions (.github/workflows/deploy.yml) after every push to main.
#
# Safety contract (do not break):
#   - database is backed up BEFORE any step (kept in /root/backups, last 10)
#   - only `prisma migrate deploy` is used (applies pending migrations, never resets)
#   - .env is gitignored and never touched by git
#   - no `migrate reset`, no `db push`, no seed, nothing destructive

set -euo pipefail

APP_DIR=/var/www/meinkun
LOG=/var/log/meinkun-deploy.log
BACKUP_DIR=/root/backups
export NODE_OPTIONS=--max-old-space-size=1280
export NEXT_TELEMETRY_DISABLED=1
export CI=1
export GIT_TERMINAL_PROMPT=0

exec >> >(tee -a "$LOG") 2>&1
echo
echo "============================================================"
date -Is
echo "deploy started"

cd "$APP_DIR"

echo "--- 1/7 db backup ---"
mkdir -p "$BACKUP_DIR"
BK="$BACKUP_DIR/meinkun-$(date +%Y%m%d-%H%M%S).sql.gz"
su - postgres -c "pg_dump -d meinkun" | gzip > "$BK"
gunzip -t "$BK"
echo "backup ok: $BK ($(stat -c%s "$BK") bytes)"
ls -1t "$BACKUP_DIR"/meinkun-*.sql.gz | tail -n +11 | xargs -r rm -f
echo "kept backups: $(ls -1 "$BACKUP_DIR" | wc -l)"

echo "--- 2/7 fetch code ---"
git fetch --depth 5 origin main
git reset --hard origin/main
git log --oneline -1

echo "--- 3/7 migrations (deploy only) ---"
npx prisma migrate deploy

echo "--- 4/7 dependencies ---"
if [ -f .git/ORIG_HEAD ] && git diff --quiet "$(cat .git/ORIG_HEAD)" HEAD -- package.json bun.lockb 2>/dev/null; then
  echo "package.json/bun.lockb unchanged -> skipping npm install"
else
  npm install --no-audit --no-fund
fi

echo "--- 5/7 build ---"
npm run build

echo "--- 6/7 restart ---"
chown -R www-data:www-data "$APP_DIR"
systemctl restart meinkun

echo "--- 7/7 health check ---"
for i in $(seq 1 20); do
  if curl -fsS --max-time 5 http://127.0.0.1:3000/ > /dev/null 2>&1; then
    echo "app healthy (attempt $i)"
    break
  fi
  if [ "$i" -eq 20 ]; then
    echo "HEALTH CHECK FAILED"
    systemctl --no-pager --lines=30 status meinkun || true
    echo "restore db if needed: gunzip -c $BK | su - postgres -c 'psql -d meinkun'"
    exit 1
  fi
  sleep 3
done
systemctl is-active meinkun minio postgresql nginx

date -Is
echo "deploy finished OK"
