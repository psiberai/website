# psiberai/website

Public site for **psiberAI** — post-quantum & compliance readiness for regulated enterprises.

FE/BE-ready monorepo. Today it ships a single **`frontend`** container (an Astro static site) behind Cloudflare. A backend is additive — drop it into `backend/` and add a service to `docker-compose.yml`.

```
website/
├─ frontend/            Astro app → built to static, served by nginx in a container
│  ├─ src/              components / layouts / pages / styles / lib / data
│  ├─ Dockerfile        multi-stage: node build → nginx:alpine
│  └─ nginx.conf
├─ backend/             (stub) future API / app container
├─ docker-compose.yml   `frontend` now; add `backend` + reverse proxy later
└─ .github/workflows/   CI: build image → GHCR → deploy
```

## Develop the frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:4321
npm run build      # static output → frontend/dist/
npm run preview
```

## Run the container locally

```bash
docker compose up --build        # serves the site on http://localhost
```

## Deploy

`git push` to `main` → GitHub Actions builds the image → pushes to GHCR → the host pulls and `docker compose up -d`. Cloudflare sits in front at cutover. See `.github/workflows/deploy.yml`.
