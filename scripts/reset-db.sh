#!/bin/bash
set -e

echo "Resetting database..."

# Drop and recreate tables
docker-compose exec -T postgres psql -U quiz -d quiz -c "DROP TABLE IF EXISTS flow_answers, flow_sessions CASCADE;"
docker-compose exec -T postgres psql -U quiz -d quiz -f /docker-entrypoint-initdb.d/init.sql

echo "Database reset complete!"

