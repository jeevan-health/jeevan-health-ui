# Jeevan HealthCare UI (v2)

Production frontend for https://jeevanhealthcare.com — clean rewrite.

## Stack

- React 19 + Vite 6 + React Router 7 + Zustand + Axios
- Brand tokens / logos / favicons retained from production

## Quick start

```bash
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api

npm install
npm run dev
```

Open http://localhost:3000

## Deploy (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `dist`
- Env: `VITE_API_URL=https://jeevan-health-api.onrender.com/api`

## Phases

| Phase | UI |
|-------|-----|
| 0 | Brand shell, home, stubs (this) |
| 1 | Auth screens |
| 2 | Diagnostics search + cart |
| 3 | Checkout + my orders |
| 4–5 | Phlebo hire + portal |
| 6 | Reports dashboard |
