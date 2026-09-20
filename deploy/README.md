# Deploy — `103.35.164.181` (temporary co-host)

Runs the frontend image CI publishes to GHCR. **Pull-based and manual** for now,
which is deliberate: `.181` is the live aletix SCADA jump host, so we don't open
SSH to GitHub's runners on it. When we move to the dedicated VPS, CI auto-deploy
(the commented `deploy` job in `.github/workflows/deploy.yml`) can be enabled there.

## Prerequisites
- The **GHCR package is public** (`ghcr.io/psiberai/website`) — so the box pulls
  with no login. (If you ever make it private, `docker login ghcr.io -u psiberai`
  on the box with a `read:packages` token first.)
- Root (or sudo) on the box.

## First-time setup
```bash
# from your Mac — copy the deploy folder to the box (adjust user/port to yours)
scp -P 33322 -r deploy/ <admin>@103.35.164.181:/root/psiberai-deploy

# on the box
cd /root/psiberai-deploy
sudo ./setup-host.sh
```
`setup-host.sh` is **additive and tunnel-safe**: it installs Docker, drops the
compose at `/opt/psiberai`, opens 80/443 *only if ufw is already active*, pulls
the image, starts the container, and verifies the site is up **and** that
`33322` (the tunnel/SSHD) is still listening. It never edits SSHD or the tunnel.

## Redeploy (after each CI publish)
```bash
# on the box
/root/psiberai-deploy/redeploy.sh
# or:  cd /opt/psiberai && docker compose pull && docker compose up -d
```

## Verify
- From outside: `http://103.35.164.181/` serves the site.
- Tunnel intact: `ss -ltn | grep 33322` still listening; aletix reverse tunnel unaffected.

## After it's live
1. **Rotate the root password** (it was shared in chat) and disable password SSH.
2. **Cloudflare cutover** (final step): add the site, replicate MX, `A` → `.181`,
   orange-cloud proxy, SSL **Full (strict)** + origin cert (add 443 to the compose
   via the Caddy/proxy block), then lock origin 80/443 to Cloudflare IP ranges.

## Files
- `docker-compose.yml` — pull-based prod compose (image only, no build)
- `setup-host.sh` — one-time host bootstrap (idempotent, safe)
- `redeploy.sh` — pull latest + restart + prune

## Later: CI auto-deploy (dedicated VPS only)
Uncomment the `deploy` job in `.github/workflows/deploy.yml` and add repo secrets:
`DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`. Do this on the
dedicated VPS, not the jump host.
