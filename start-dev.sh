#!/bin/bash
echo "Waiting DB to start"
while ! nc -z ${POSTGRES_HOST}  ${POSTGRES_PORT}; do sleep 3; done
rm -f /src/tmp/pids/server.pid
bundle exec puma -C /app/config/puma.rb