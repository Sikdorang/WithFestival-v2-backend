#!/bin/sh
set -e

if [ -z "${DATABASE_URL}" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

for dir in prisma/migrations/*/; do
  [ -d "$dir" ] || continue
  if [ ! -f "${dir}migration.sql" ]; then
    echo "entrypoint: removing incomplete migration dir: $dir" >&2
    rm -rf "$dir"
  fi
done

npx prisma migrate deploy
exec node dist/src/main.js
