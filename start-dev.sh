#!/bin/bash
echo "Waiting DB to start"
while ! nc -z db 5432; do sleep 3; done
rm -f /src/tmp/pids/server.pid
bundle exec puma -C /app/config/puma.rb