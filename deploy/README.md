# Deploy — `psiberai.com`

**Live** on `103.35.164.181` (temporary co-host on the aletix jump host), served
via an **outbound Cloudflare Tunnel** — the box has **no public web ports** (only
SSH). `docker-compose.yml` runs the `frontend` image (from GHCR) plus
`cloudflared`; Cloudflare routes `psiberai.com` / `www` → `http://frontend:80`.

## How it's wired
- **CI** builds `frontend/` → pushes `ghcr.io/psiberai/website:latest` (public package)
- The box runs `frontend` (internal `:80`) + `cloudflared` (dials out to Cloudflare)
- The tunnel token lives only in `/opt/psiberai/.env` (gitignored); `.env.example` is the template
- CI auto-deploy: on push to `main`, the `deploy` job SSHes in and runs `docker compose pull && up -d`

## First-time setup on a host
```bash
# from your Mac — copy deploy/ to the box, then create .env with the tunnel token
scp -P <ssh-port> -r deploy/ <admin>@<host>:/root/psiberai-deploy
# on the box:
cd /root/psiberai-deploy
cp .env.example .env && edit .env   # CLOUDFLARE_TUNNEL_TOKEN=...
sudo ./setup-host.sh
```
Then in Cloudflare (Zero Trust → Networks → Tunnels → your tunnel → Public
Hostname) route `psiberai.com` and `www` → `http://frontend:80`. No DNS A record,
no origin cert, no open ports.

## Redeploy
```bash
cd /opt/psiberai && docker compose pull && docker compose up -d
# or:  ./redeploy.sh
```

## Move to a new host (portability)
Because the tunnel is outbound, moving hosts needs **no DNS/IP/cert change**:
1. `setup-host.sh` on the new box (same `deploy/` + `.env` / same token)
2. Confirm it serves, then stop the old box. (Run both briefly for zero downtime.)
Nothing is tied to the IP.

## Adding the backend later
Uncomment the `backend` service in `docker-compose.yml` (private image, `expose`
only, secrets via `env_file`), then add a tunnel public hostname
`app.psiberai.com → http://backend:8000`. **No public IP needed** — served
outbound through the same tunnel.

## Files
- `docker-compose.yml` — production compose (frontend + cloudflared, tunnel)
- `.env.example` — template for `CLOUDFLARE_TUNNEL_TOKEN` (`.env` is gitignored)
- `setup-host.sh` — host bootstrap (Docker + up; no public ports)
- `redeploy.sh` — pull latest + restart + prune

## CI auto-deploy
The `deploy` job in `.github/workflows/deploy.yml` runs when repo variable
`DEPLOY_ENABLED=true` and secrets `DEPLOY_HOST/PORT/USER/SSH_KEY` are set.
