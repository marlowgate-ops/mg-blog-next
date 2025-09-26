# Copilot Instructions (mg-blog-next)

## Goals
- Make `/best/forex-brokers-jp` visually match the reference site (layout, section bands, colors, spacing, table UX, right-rail nav). Keep our copy/links/PR ribbon. Do not copy external text.

## Modes
- **Phase A (UI-Only / default)**: Edit only
  - `app/best/forex-brokers-jp/page.tsx`
  - `app/best/layout.module.css`
  - `components/{RankingCardNew.tsx, CompareTable.tsx, SectionBand.tsx, TocCard.tsx, PrimaryCta.tsx}`
  - `styles/globals.css` (design tokens only)
- **Phase B (Infra-Allowed / when explicitly asked)**: You may also touch
  - `package.json` (dev-only tools), `package-lock.json`
  - `.github/workflows/*` (build/test only), `playwright/*`
  - `postcss.config.*` (safe plugins only)
  - **Never** change environment secrets or production runtime flags.

## Rules
- CSS Modules only: `import s from ...` and `className={s.*}`; avoid nesting plugins unless Phase B is active.
- Small commits; after each step: `npm run -s build` → **0 warnings**.
- If the same file loops twice with no improvement, stop editing it and switch to TSX wiring or other files.
- PR body: before/after screenshots + list of changed files (bytes & sha256).

## Phase B Guardrails
- Dev-deps only; exact versions; `npm ci && npm run -s build` must stay clean.
- Remove dev-only tools before merge if not needed at runtime.
