#!/bin/bash
set -e

echo "Starting Client-Side Quiz..."

# Start PostgreSQL
echo "Starting PostgreSQL..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until docker-compose exec -T postgres pg_isready -U quiz -d quiz > /dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start dev server
echo "Starting Next.js dev server..."
npm run dev

