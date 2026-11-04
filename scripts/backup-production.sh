#!/usr/bin/env bash
# Consistent DB dump + object files. Stored locally; copy off-server as well.
set -Eeuo pipefail
umask 077
exec 9>/var/lock/meinkun-deploy.lock
flock -w 1800 9
ROOT=/root/backups/daily
mkdir -p "$ROOT"
STAMP="$(date +%Y%m%d-%H%M%S)"
DIR="$ROOT/$STAMP.partial"
mkdir "$DIR"
docker exec meinkun-db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB"' | gzip > "$DIR/database.sql.gz"
gunzip -t "$DIR/database.sql.gz"
MEDIA="$(docker inspect meinkun-minio --format '{{range .Mounts}}{{if eq .Destination "/data"}}{{.Source}}{{end}}{{end}}')"
[[ -d "$MEDIA" && "$MEDIA" == /var/lib/docker/volumes/*/_data ]]
# Files are backed up live; for a strict point-in-time backup pause uploads.
tar -C "$MEDIA" -czf "$DIR/media.tar.gz" .
tar -tzf "$DIR/media.tar.gz" >/dev/null
cp /var/www/meinkun/.env.production "$DIR/environment"
cp -a /data/nginx "$DIR/nginx"
docker run --rm --network none -v nginx_secrets:/certificates:ro \
  -v "$DIR:/backup" alpine:3.22 tar -czf /backup/certificates.tar.gz -C /certificates .
mv "$DIR" "$ROOT/$STAMP"
find "$ROOT" -mindepth 1 -maxdepth 1 -type d -mtime +7 -exec rm -rf -- {} +
echo "Backup complete: $ROOT/$STAMP"
