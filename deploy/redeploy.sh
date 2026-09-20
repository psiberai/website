#!/usr/bin/env bash
# psiberAI — redeploy the latest published image on the host.
# Run after CI publishes a new ghcr.io/psiberai/website:latest.
set -euo pipefail
cd /opt/psiberai
echo "==> pulling latest image"
docker compose pull
echo "==> restarting with the new image"
docker compose up -d
echo "==> pruning old images"
docker image prune -f
echo "==> done:"
docker compose ps
