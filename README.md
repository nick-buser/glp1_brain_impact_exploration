# GLP-1 Brain Mechanism Atlas

An interactive mechanism explorer for how GLP-1 receptor agonists act on the
brain — framed as a mechanism atlas (isolated panels, overlay, evidence mode)
rather than a linear review.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- React Router
- `@xyflow/react` — circuit/claim graphs
- Framer Motion — animation
- Zod — mechanism/evidence schemas

## Develop

```bash
pnpm install
pnpm dev      # dev server
pnpm build    # typecheck + production build
pnpm lint
```

## Layout

```
docs/      design + research docs (PRD, engineering, UI/UX, vision, deep research)
designs/   exported design artboards (.jsx / tokens.css)
src/
  lib/sections.ts   information architecture (the IA / route map)
  pages/            section pages
```

## Remote workflow

- Hosted on Gitea: `git@git.lab:nick-b/glp-1-work.git`
- Dev server checkout: `dev@research-lab.lab:/workspace/glp-1-work`
- Edit locally → push → `git pull` on the dev server.
