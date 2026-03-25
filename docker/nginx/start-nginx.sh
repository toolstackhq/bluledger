#!/bin/sh
set -eu

PORT="${PORT:-8080}"
export PORT

envsubst '${PORT}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "BluLedger container started on port ${PORT}"

exec nginx -g 'daemon off;'
