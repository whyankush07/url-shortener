#!/bin/bash

set -e

echo "Installing dependencies..."
bun install

echo "Running migrations..."
bun run db:migrate

echo "Starting server..."
bun run start
