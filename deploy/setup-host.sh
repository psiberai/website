#!/usr/bin/env bash
# =============================================================================
# psiberAI — one-time host bootstrap for the frontend container.
#
# SAFE BY DESIGN on the aletix jump host (103.35.164.181):
#   • ADDITIVE ONLY — installs Docker, deploys the frontend image, opens 80/443.
#   • NEVER touches SSHD, port 33322, or the aletix reverse tunnel.
#   • NEVER enables ufw (that could lock out 33322); only adds 80/443 rules if
#     ufw is ALREADY active.
#
# Usage (as root, from the copied deploy/ folder on the box):
#   sudo ./setup-host.sh
# Redeploy later:  ./redeploy.sh   (or: cd /opt/psiberai && docker compose pull && docker compose up -d)
# =============================================================================
set -euo pipefail

APP_DIR="/opt/psiberai"
SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE_SRC="$SELF_DIR/docker-compose.yml"

log() { printf '==> %s\n' "$*"; }

[ "$(id -u)" -eq 0 ] || { echo "ERROR: run as root (sudo)."; exit 1; }
[ -f "$COMPOSE_SRC" ] || { echo "ERROR: docker-compose.yml not found next to this script."; exit 1; }

log "psiberAI host setup — additive; will NOT touch 33322 or the aletix tunnel."

# --- 1. Docker Engine + compose plugin (idempotent) --------------------------
if command -v docker >/dev/null 2>&1; then
  log "Docker already present: $(docker --version)"
else
  log "Installing Docker Engine + compose plugin"
  apt-get update -y
  apt-get install -y ca-certificates curl
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  . /etc/os-release
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
  log "Installed: $(docker --version)"
fi

# --- 2. App dir + compose ----------------------------------------------------
mkdir -p "$APP_DIR"
install -m 0644 "$COMPOSE_SRC" "$APP_DIR/docker-compose.yml"
log "Compose placed at $APP_DIR/docker-compose.yml"

# --- 3. Firewall — ONLY if ufw is already active. Never enable it. -----------
if command -v ufw >/dev/null 2>&1 && ufw status 2>/dev/null | grep -q "Status: active"; then
  log "ufw active — allowing 80/443 (33322 + tunnel rules left untouched)"
  ufw allow 80/tcp  || true
  ufw allow 443/tcp || true
else
  log "ufw not active — NOT enabling it (would risk locking out 33322)."
  log "    Open 80/443 in the CloudPe firewall / security group instead."
fi

# --- 4. Pull image (public package) + run ------------------------------------
cd "$APP_DIR"
log "Pulling image + starting the container"
docker compose pull
docker compose up -d

# --- 5. Verify: site up + tunnel intact --------------------------------------
sleep 3
printf '==> local check: http://localhost/ -> '
curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://localhost/ || echo 'FAILED'

printf '==> aletix tunnel/SSHD sanity: 33322 '
if ss -ltn 2>/dev/null | grep -q ':33322'; then
  echo 'still LISTENING (OK)'
else
  echo 'NOT seen — investigate before continuing!'
fi

log "Done. Verify from outside:  http://103.35.164.181/"
log "Then: rotate the root password, and proceed to the Cloudflare cutover."
