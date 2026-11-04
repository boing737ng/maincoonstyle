# Production: 77.91.112.242

## Архитектура

Ubuntu 22.04, 2 vCPU, 2 ГБ RAM. GitHub Actions собирает два образа,
передаёт их по SSH и запускает точный SHA коммита из `main`.
VPS не компилирует Next.js. PostgreSQL и S3 не публикуют порты.
Входящий трафик: SSH 22, HTTP 80 (ACME/redirect), HTTPS 443.
Provider-managed Nginx/Certbot остаётся в `/data/nginx`.
Временный адрес: `https://nginx-certbot51405.hostkey.in`.

Лимиты RAM: app 640 МБ, PostgreSQL 320 МБ, RustFS 640 МБ.
Swap — аварийный запас, а не замена оперативной памяти. При росте нагрузки
контролировать `docker stats`, `free -h`, диск и ошибки OOM.

## Деплой

Push в `main` → build в Actions → upload образов → backup БД →
миграции → запуск app → проверка Nginx → внешний HTTPS health check.
Образы помечены SHA; сборка с ошибкой не обновляет запущенный сайт.
Миграции не откатываются автоматически: при несовместимой миграции требуется
отдельный план восстановления.

Секреты сайта: `/var/www/meinkun/.env.production`, root-only, `0600`.
Secrets GitHub: `DEPLOY_SSH_{KEY,HOST,USER,PORT,KNOWN_HOSTS}` и все
используемые `NEXT_PUBLIC_*`. Публичные значения фиксируются **при сборке**,
поэтому при смене домена нужно обновить и серверный env, и GitHub secrets.
Сам SSH-ключ CI ограничен forced command `/usr/local/sbin/meinkun-ci`.
Он обладает правами deployment (Docker), но не предназначен для ручного входа.

Лог: `/var/log/meinkun-deploy.log`, текущий релиз: `.deployed-sha`.
Рабочая директория: `/var/www/meinkun`.

```bash
cd /var/www/meinkun
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker logs --tail 100 meinkun-app
docker stats --no-stream
docker compose -f /data/nginx/docker-compose.yml logs --tail 100
```

Повторить последний релиз можно через GitHub → Actions → deploy → Run workflow.
Для ручного повтора: `bash scripts/server-deploy.sh <полный SHA>`.
Старые SHA-образы пока хранятся для восстановления: следить за диском;
не удалять volumes и резервные копии командами prune.

## Подключение своего домена

Нужны зарегистрированный домен, доступ к DNS и адрес владельца для Let's Encrypt.
Пока домен неизвестен, его сертификат **не выпускается**.

1. В текущей DNS-панели создать `A @ → 77.91.112.242`.
   Для `www`: `CNAME www → ваш-домен` (либо такой же A).
   TTL 300–600. Не трогать MX/TXT почты и NS без необходимости.
   Удалить конфликтующие A/AAAA для этих имён, если они ведут не на этот сервер.
   Если используется Cloudflare, при первом подключении оставить DNS only.
2. Проверить из внешней сети `dig +short A домен` и `dig +short AAAA домен`.
   Проверить и `www`, если он нужен. AAAA добавлять только для реально
   настроенного IPv6. CAA, если есть, должен разрешать `letsencrypt.org`.
3. Скопировать `deploy/nginx-meinkun.conf` в
   `/data/nginx/user_conf.d/домен.conf`, заменить `__MEINKUN_HOSTNAME__`
   на домен. У **нового** server block убрать `default_server reuseport`:
   временный Hostkey server остаётся default. Для `www` добавить его в
   `server_name` и затем настроить redirect на выбранный основной домен.
4. Изменить CERTBOT_EMAIL в provider Compose (его `environment` имеет
   приоритет над env_file) на согласованный адрес владельца.
   Пересоздать только provider nginx:
   `docker compose -f /data/nginx/docker-compose.yml up -d --force-recreate nginx`.
   Его startup-скрипт выпустит сертификат для нового конфига.
   Проверить logs и `certbot certificates`; не запускать многократно
   force-renewal, чтобы не попасть в лимит Let's Encrypt.
5. После успешного HTTPS поменять в серверном `.env.production`
   `NEXT_PUBLIC_SITE_URL=https://домен`,
   `NEXT_PUBLIC_S3_PUBLIC_URL=https://домен/media`.
   Обновить те же secrets в GitHub и выполнить Run workflow.
   Деплой не объявляет второй default server, если старый Hostkey сайт сохранён.
6. Проверить редирект HTTP → HTTPS, сертификат, страницы, админ-вход,
   загрузку/просмотр фотографий, canonical и sitemap.
   Фотографии в БД могут иметь абсолютные старые URL: перед выключением
   временного адреса проверить их и при необходимости мигрировать префикс.

Для нового домена лучше заранее сделать PR с явными server blocks основного
домена, `www` и временного адреса, а не удалять работающий Hostkey конфиг.

## Резервные копии

Перед деплоем: SQL в `/root/backups`, сохраняются последние 10 дампов.
Ежедневный `scripts/backup-production.sh` копирует БД, media, env, Nginx
и сертификаты в `/root/backups/daily`, хранит около 7 дней.
Бэкап фото выполняется на живом хранилище: для строгой согласованности
нужно временно остановить загрузку фотографий.
Копии на том же VPS **не защищают от потери сервера**; нужен согласованный
внешний storage или provider snapshots. Файлы копий содержат секреты.

Восстановление сначала проверить в отдельном окружении. SQL загружается через
`gunzip -c database.sql.gz | docker exec -i meinkun-db psql ...`;
перед импортом остановить app, сохранить текущую БД и проверить совместимость
схемы/версии кода. Media восстанавливать только в остановленный S3 volume,
сохраняя права. `docker compose down -v` в production не выполнять.

## Доступ и восстановление SSH

Не выключать пароль/root и не менять AllowUsers, пока второй независимый
SSH-вход по человеческому ключу не проверен. Перед изменением sshd:
`sshd -t`; держать существующую сессию открытой. У владельца должен быть
доступ к Hostkey console/KVM для восстановления.
Пароль, переданный в чате, заменить вручную и сохранить в менеджере паролей.
