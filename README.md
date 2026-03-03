# EcoLead

EcoLead is a Next.js 16 (App Router + TypeScript + Tailwind) app with Supabase auth and an AI-backed impact plan generator.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment configuration

1. Copy `.env.example` to `.env.local`.
2. Set these values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (defaults to `gpt-4o-mini`)
3. Visit `/env-check` to verify configuration without exposing sensitive values.

## Deploy to Vercel

### Required environment variables

Set these in Vercel Project Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional override, default `gpt-4o-mini`)

### Supabase Auth redirect URLs

In Supabase Auth settings, configure:

- Local development URL: `http://localhost:3000/**`
- Vercel production URL: `https://<your-vercel-domain>/**`

(If using preview deployments, add `https://*.vercel.app/**` as needed.)

### Deployment steps

1. Push this repo to GitHub.
2. Import the repository in Vercel.
3. Add the required environment variables.
4. Deploy.

## Build

```bash
npm run build
```
