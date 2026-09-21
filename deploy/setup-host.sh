#!/usr/bin/env bash
# =============================================================================
# psiberAI — host bootstrap for the Cloudflare-Tunnel deployment.
#
# Brings a NEW host up to serve the site via the outbound Cloudflare Tunnel:
# installs Docker, runs the frontend + cloudflared containers. NO public web
# ports are opened (the tunnel is outbound), so the host's only inbound port is
# whatever SSH you already use.
#
# SAFE on a co-hosted box (e.g. the aletix jump host): additive only, never
# touches SSHD / port 33322 / any existing tunnel.
#
# Prereq: deploy/.env next to this script with the tunnel token:
#     CLOUDFLARE_TUNNEL_TOKEN=...
# (get it from Zero Trust → Networks → Tunnels → your tunnel → the docker token)
#
# Usage (as root, from the copied deploy/ folder):
#     sudo ./setup-host.sh
# =============================================================================
set -euo pipefail

APP_DIR="/opt/psiberai"
SELF_DIR="$(cd "$(dirname "$0")" && pwd)"

log() { printf '==> %s\n' "$*"; }

[ "$(id -u)" -eq 0 ] || { echo "ERROR: run as root (sudo)."; exit 1; }
[ -f "$SELF_DIR/docker-compose.yml" ] || { echo "ERROR: docker-compose.yml not found next to this script."; exit 1; }
[ -f "$SELF_DIR/.env" ] || { echo "ERROR: create deploy/.env with CLOUDFLARE_TUNNEL_TOKEN=... first (see .env.example)."; exit 1; }

log "psiberAI host setup — Cloudflare Tunnel; no public web ports; SSH/tunnel untouched."

# --- Docker (idempotent) -----------------------------------------------------
if command -v docker >/dev/null 2>&1; then
  log "Docker already present: $(docker --version)"
else
  log "Installing Docker + compose plugin"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y
  apt-get install -y docker.io docker-compose-v2
  systemctl enable --now docker
  log "Installed: $(docker --version)"
fi

# --- app dir + files ---------------------------------------------------------
mkdir -p "$APP_DIR"
install -m 0644 "$SELF_DIR/docker-compose.yml" "$APP_DIR/docker-compose.yml"
install -m 0600 "$SELF_DIR/.env"               "$APP_DIR/.env"
log "compose + .env placed at $APP_DIR"

# --- run ---------------------------------------------------------------------
cd "$APP_DIR"
log "Pulling images + starting (frontend + cloudflared)"
docker compose pull
docker compose up -d

# --- verify: tunnel connected + frontend healthy -----------------------------
sleep 12
log "cloudflared connections:"
docker logs psiberai-cloudflared 2>&1 | grep -c "Registered tunnel connection" | sed 's/^/    registered: /'
docker compose ps --format 'table {{.Name}}\t{{.Status}}' | sed 's/^/    /'

log "Done. In Cloudflare, route the public hostname(s) to http://frontend:80."
log "No 80/443 to open — the tunnel is outbound. Verify: https://psiberai.com"
