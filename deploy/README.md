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

## Cloudflare cutover — via Tunnel (recommended)

A **Cloudflare Tunnel** is the portable + secure edge: `cloudflared` dials OUT to
Cloudflare, so there's **no public origin port, no A record, and no origin cert**.
The box's 80/443 can be closed entirely.

Cutover steps:
1. Add `psiberai.com` to Cloudflare (move nameservers off GoDaddy). **Replicate the
   MX + any other records first** so mail keeps working.
2. Zero Trust → Networks → **Tunnels → Create a tunnel** → copy the token.
3. Route the tunnel's **public hostname** `psiberai.com` (and `www`) to the service
   **`http://frontend:80`**.
4. On the box: `cd /opt/psiberai`, put the token in `deploy/.env`
   (`CLOUDFLARE_TUNNEL_TOKEN=...`), then run with the tunnel compose:
   ```bash
   docker compose -f docker-compose.tunnel.yml up -d
   ```
5. Once traffic flows through the tunnel, **close the public web ports**:
   `ufw delete allow 80/tcp && ufw delete allow 443/tcp` (33322 stays).

### Host portability
Because the tunnel is outbound, **moving to a new host requires no DNS or cert
change**: stand up Docker on the new box, copy this `deploy/` folder + `.env`
(same token), `docker compose -f docker-compose.tunnel.yml up -d`, and traffic
follows. You can even run both hosts briefly for a zero-downtime move, then stop
the old one. Nothing is tied to the IP.

_Alternative (origin certificate):_ if you'd rather keep a public origin IP, run a
TLS terminator (Caddy) with a Cloudflare **Origin Certificate** on 443 and set SSL
**Full (strict)**; moving hosts then means re-pointing the `A` record to the new IP
(the cert is hostname-bound, so it's reused as-is). The tunnel avoids all of that.

## After it's live
- **Rotate the `.181` root password** (it was shared in chat).

## Files
- `docker-compose.yml` — current pull-based prod compose (frontend on host :80)
- `docker-compose.tunnel.yml` — cutover compose (Cloudflare Tunnel; no host ports)
- `.env.example` — template for the tunnel token (`.env` is gitignored)
- `setup-host.sh` — one-time host bootstrap (idempotent, safe)
- `redeploy.sh` — pull latest + restart + prune

## CI auto-deploy
Enabled: the `deploy` job in `.github/workflows/deploy.yml` runs when the repo
variable `DEPLOY_ENABLED=true` and the secrets `DEPLOY_HOST/PORT/USER/SSH_KEY`
are set. On the tunnel compose, point the deploy script at
`docker compose -f docker-compose.tunnel.yml pull && up -d`.
