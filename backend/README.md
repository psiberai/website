# backend (stub)

Reserved for the future psiberAI API / app (likely **FastAPI** — Python-native for the ML & security tooling, or Node to share the frontend stack).

When it lands:
1. Add the service code here + a `Dockerfile`.
2. Uncomment the `backend` and `proxy` services in the root `docker-compose.yml`.
3. Point the frontend's `submitContact()` seam (`frontend/src/lib/validation.ts` + the contact form) at `/api/contact`.

Nothing in the frontend needs rewriting — the reverse proxy routes `/api` here and `/` to the frontend.
