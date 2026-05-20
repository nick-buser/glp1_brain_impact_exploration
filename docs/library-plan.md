# Library & Dependency Plan: GLP-1 Brain Mechanism Atlas

Reference document. Each section: what to install, why this over alternatives, how it fits the atlas specifically.

## Stack at a glance

```bash
# Core
pnpm add next react react-dom
pnpm add -D typescript @types/react @types/node @types/d3 tsx @biomejs/biome

# Styling + UI
pnpm add tailwindcss @tailwindcss/postcss postcss clsx tailwind-merge
pnpm dlx shadcn@latest init

# Content
pnpm add @next/mdx @mdx-js/react @mdx-js/loader rehype-citation

# Data integrity
pnpm add zod

# Graphs + custom viz
pnpm add @xyflow/react
pnpm add cytoscape react-cytoscapejs cytoscape-fcose
pnpm add d3

# Animation
pnpm add motion animejs @react-spring/web

# Molecular
pnpm add molstar

# State
pnpm add zustand nuqs
```

Package manager: pnpm recommended (faster, stricter dep graph), but npm/yarn fine. Node 20+.

---

## Core framework

### Next.js 15 (App Router) + React 19 + TypeScript

**Why**: Vercel-native deploy, React Server Components let the JSON-fetched-at-build data flow into pages without API routes, file-based routing scales cleanly to the ~12 mechanism tabs, MDX support is first-class. The build-time data pipeline pattern (covered below) depends on RSC.

**Alternatives ruled out**:
- *Vite + React* — simpler dev, but no built-in pattern for the prose+data+component split. Would have to assemble it.
- *Astro* — superb for content-heavy, but the workbench/interactive tabs fight Astro's islands model. The atlas is interactivity-first.
- *Remix* — fine framework, less Vercel-symbiotic; loses on smoothness here.

**How used**: each `/mechanisms/[slug]` route is an MDX page. Static data lives in `/data/*.json`, validated by Zod, imported into server components at build, passed to client components as props.

TypeScript is non-optional — the claim/evidence schema invariants from the design docs are load-bearing and need compile-time enforcement.

---

## Styling and UI primitives

### Tailwind CSS v4

**Why**: speed of iteration matters when twelve tabs each need their own visual grammar, and Tailwind's utility classes work fluidly on SVG elements (which is most of the viz surface). Design tokens stay consistent across tabs without per-component CSS files. v4 is meaningfully faster than v3.

**Alternatives ruled out**:
- *vanilla-extract* — better type safety, slower iteration; not worth the trade here.
- *styled-components / emotion* — runtime cost on viz-heavy pages.
- *CSS modules* — fine, but more boilerplate per tab.

### shadcn/ui + Radix primitives

**Why**: the atlas leans heavily on Tooltip, Popover, Dialog, Slider, Select, Tabs — the evidence hover cards, moderator dashboard sliders, lens switcher, paper-detail dialogs all need accessible primitives. shadcn gives you copyable Radix-based components you own and can restyle freely.

**Alternatives ruled out**:
- *Headless UI* — less complete primitive set.
- *Mantine* — heavier, more opinionated, fights Tailwind.
- *Build from scratch* — months of accessibility work for no upside.

### clsx + tailwind-merge

**Why**: conditional Tailwind classes without specificity collisions. Standard now.

---

## Content layer

### MDX (@next/mdx)

**Why**: each tab follows the skeleton from the design doc — one-sentence claim, visual, controls, evidence, caveats, couplings. MDX lets you author the prose as Markdown and drop `<MechanismFlow id="wanting" />` or `<EvidenceMatrix domain="alcohol" />` mid-paragraph. Authoring stays close to natural writing while components render where they're needed.

**Alternatives ruled out**:
- *Contentlayer* — sunsetting / unmaintained.
- *Velite* — newer Contentlayer alternative, less mature.
- *Plain markdown + custom parser* — loses the inline-component superpower, which is the whole point.

### rehype-citation

**Why**: the atlas is citation-dense — every claim has provenance, every paper deserves linking. Hand-rendering `[Wang et al. 2024]` as inline JSX gets miserable fast. rehype-citation plugs into the MDX pipeline so you write `[@wang2024]` in prose and it renders formatted citations with linked references plus an auto-generated bibliography page. Reads `data/citations.bib` or CSL-JSON; supports any CSL style (Vancouver, APA, Nature, etc.).

**Alternatives ruled out**:
- *Hand-rolled citation components* — works for ~20 citations, painful for ~200.
- *citation-js direct* — that's actually what rehype-citation uses under the hood; the rehype plugin gives you the MDX integration for free.

**How used**: keep references in `data/citations.bib`, configure rehype-citation in the MDX pipeline (`next.config.mjs`), cite by key in prose, render bibliography on a `/references` page. For DOI metadata at build time: **Crossref REST API** (free, no auth) or **OpenAlex** (richer metadata) — same pattern as the ChEMBL/PubChem fetch scripts.

---

## Data integrity

### Zod

**Why**: the design docs are explicit that every claim must carry confidence and provenance, every edge must carry context (dose/route/chronicity/species). Zod schemas in `lib/schemas.ts` validate `data/*.json` at build time. If someone adds a claim without a confidence field, the build fails. This is how the courtroom invariant gets enforced rather than wished into existence.

**Alternatives ruled out**:
- *Plain TS types* — no runtime validation, drift inevitable.
- *io-ts* — more verbose, less idiomatic in 2026.
- *ArkType* — newer, smaller ecosystem; revisit later if perf matters.
- *Valibot* — leaner alternative to Zod; would work, but Zod's ecosystem (especially with React Hook Form if forms appear later) is unmatched.

---

## Graph visualization

The atlas wants two different idioms here and they have non-overlapping strengths.

### @xyflow/react (React Flow)

**Why**: the workbench/courtroom tabs — overview atlas, claim graph, evidence workbench — need clickable nodes that pop open rich React panels (paper provenance, confidence breakdown, scope conditions). React Flow's "every node is a React component" model is exactly that. Custom handles, edge interactions, mini-map, controls all work out of the box.

**Alternatives ruled out**:
- *Cytoscape* (covered next) — better for *aesthetics*, worse for *interactive node UIs*.
- *reagraph* — 3D-first, overkill.
- *react-force-graph* — algorithm-first; we want layout control, not auto-spring.

**How used**: overview atlas (global mechanism graph with lens-mode toggles), evidence workbench (table-graph hybrid), claim explorer.

### cytoscape + react-cytoscapejs + cytoscape-fcose

**Why**: the projection-heavy anatomical tabs — wanting (VTA→NAc→VP→PFC), cross-reward radial substrate, amygdala-GABA, HPA split — need edge aesthetics that read as neural projections, not as UML arrows. Cytoscape's selector-based styling gives you gradients, curved edges with bundle aesthetics, edge weighting by evidence strength, and force-directed layouts (via the fcose plugin, which handles radial well) without writing layout math. Reactome, WikiPathways, and most bio-network apps run on Cytoscape for exactly this reason.

**Alternatives ruled out**:
- *Pure D3 force* — works, but Cytoscape's styling DSL saves weeks.
- *sigma.js* — designed for graphs with thousands of nodes; we have dozens.
- *vis-network* — older, less actively maintained.

**How used**: dedicated to anatomical / projection tabs. Don't reach for it on the workbench tabs — different idiom.

---

## Custom data viz

### d3 (raw, per your call)

**Why**: anything that isn't a graph or anatomical SVG — the dopamine trace timeline on the wanting tab, satiety-aversion threshold curves on the appetite tab, evidence-strength heatmaps, the gastric-emptying timeline, the wanting/liking/learning/effort decomposition bars. Custom domain visuals where Recharts-shaped abstractions get in the way.

**Alternatives ruled out**:
- *Visx* — you ruled this out; would have given React-friendlier composability, but raw D3 buys more control for less abstraction tax.
- *Recharts / nivo* — too constrained for the bespoke domain charts.
- *Observable Plot* — high-level, less control over animation hooks and event handling.

**How used**: install `d3` and import only the modules you need per component (`import { scaleLinear, scaleBand } from 'd3-scale'`) — modern bundlers tree-shake well. The discipline: **render SVG that React owns** (state-driven attrs in JSX), use D3 only for computation (scales, layouts, paths, interpolators). Don't let D3 mutate the DOM directly — that fights React. The pattern that works:

```tsx
const xScale = scaleLinear().domain([0, 1]).range([0, width]);
const pathD = line<DataPoint>().x(d => xScale(d.t)).y(d => yScale(d.v))(data);
return <path d={pathD ?? undefined} className="stroke-current" />;
```

This is the cleanest split — D3 does the math, React does the rendering, animation hooks into the path attribute changes.

---

## Animation

Division of labor across three libraries, each pulling its weight.

### motion (formerly Framer Motion)

**Why**: component-level animation — tab transitions, AnimatePresence for lens-mode swaps, hover/tap states on cards, layout animations when filters change. The most React-native motion library. Note: Framer Motion was renamed to `motion` in late 2024; same library, new name.

**Alternatives ruled out**:
- *react-transition-group* — legacy, far less ergonomic.
- *auto-animate* — limited scope.

### animejs

**Why**: SVG path animation specifically — signal-flow along axonal projections (a dopamine pulse traveling VTA→NAc), dashoffset reveals on circuit edges as the user toggles a state dial, multi-step pathway animations. anime.js' MotionPath support and timeline are exactly the right shape for "neural signal travels along this curve."

**Alternatives ruled out**:
- *GSAP* — more powerful, heavier bundle, recently relicensed but still feels overkill until proven needed. Defer.
- *SMIL* — dead.
- *CSS animations* — path-following is awkward without `offset-path`, which has gotchas.

### @react-spring/web

**Why**: physics-based interaction — the PPG-NTS state dial (fasted ↔ fed ↔ large meal ↔ stress ↔ pharmacologic) wants momentum and damping as you drag, not eased transitions. Same for moderator dashboard sliders where the viz should settle naturally. react-spring's interpolation flexibility for compound outputs (one drag input → many output curves moving in coordination) beats motion's spring API.

**Alternatives ruled out**:
- *motion's spring transitions* — adequate but less ergonomic for compound interpolation.
- *use-spring (third party)* — effectively the same approach, smaller ecosystem.

**Rule of thumb**: motion for components, anime.js for SVG paths, react-spring for physics-coupled interactions. If a tab needs choreographed multi-element timelines (e.g., an explanatory Manim-replacement sequence), revisit GSAP at that point.

---

## Molecular visualization

### molstar

**Why**: 3D peptide-receptor structure rendering — the brain-access tab benefits from one or two hero moments where the user can see semaglutide actually nestled into the GLP-1R extracellular domain. Mol* is what RCSB.org embeds on every PDB page; rendering quality is the bar, and the atlas has aesthetic ambitions.

**Alternatives ruled out**:
- *3Dmol.js* — lighter and easier to integrate, but lower rendering quality. If bundle size becomes a real problem later, this is the fallback.
- *NGL Viewer* — good, slightly less actively developed.
- *PV* — abandoned.

**How used**: dynamic import only — `const Molstar = dynamic(() => import('@/components/MolstarViewer'), { ssr: false })`. Mol* is a heavy bundle and should never load on tabs that don't use it. Fetch PDB CIF files at build time, serve from `/public/structures/`.

For the **2D peptide sequence + modifications** view (which matters more for the day-to-day mechanism story than the 3D view), write custom SVG. Each agonist gets a sequence track of 30-39 residues, color-coded by property, with modifications rendered as branches off the relevant residue (the C18 diacid on semaglutide's Lys26, the Aib at position 2, etc.). No library needed — anime.js handles the decoration animations cleanly.

---

## State management

### zustand

**Why**: cross-component client state — current lens mode, evidence-layer filter, selected drug for comparison, expanded panels. No provider gymnastics, no re-render churn, plays well with RSC (stores are client-only and import naturally).

**Alternatives ruled out**:
- *Jotai* — atomic model is fine, slightly different mental model; preference call.
- *Redux Toolkit* — overkill for this scope.
- *React Context* — re-renders cascade through viz components, kills interaction perf.

**Discipline**: Zustand holds *UI state*, not *data*. Data lives in build-time JSON consumed via RSC props. Mixing the two is the classic state-management failure mode.

### nuqs

**Why**: URL-synced state with typed hooks for App Router. "Send me a link to the cross-reward graph filtered to human-RCT evidence at chronic dosing" should produce a sharable URL that hydrates exactly that view. nuqs makes search params first-class without serialization boilerplate.

**Alternatives ruled out**:
- *Manual useSearchParams + URLSearchParams* — works, no type safety, error-prone.
- *query-string + custom hooks* — reinventing nuqs.

**How used**: lens mode, evidence filters, selected mechanism/drug, comparison overlays — anything that should survive a refresh and be link-shareable.

---

## Build-time data pipeline

No backend, no DB — Vercel + static JSON.

### tsx for runner; native fetch

```bash
pnpm add -D tsx
```

**Why**: scripts in `/scripts/` fetch from PubChem PUG-REST (drug structures, names, identifiers), ChEMBL REST (binding affinities, mechanism annotations, indications), RCSB PDB (structure files for Mol*). Output `data/*.json` and `public/structures/*.cif`. Run via `pnpm build:data` before `next build`. Results committed to repo for reproducibility and zero-runtime-cost.

**Alternatives ruled out**:
- *Standing up a backend* — out of scope, premature.
- *Vercel KV / Neon at this stage* — premature.
- *Contentlayer-style processing* — sunsetting, and the data needs custom transformations anyway.

**Suggested layout**:
```
scripts/
  fetch-chembl.ts       # binding data, MoA, indications
  fetch-pubchem.ts      # structures, identifiers
  fetch-pdb.ts          # 3D structures for Mol*
  build-data.ts         # orchestrator
data/
  drugs.json            # validated by Zod schema
  mechanisms.json
  claims.json
  evidence.json
public/structures/
  semaglutide.cif       # for Mol*
  ...
```

If/when the data pipeline grows beyond what static JSON handles cleanly (>5MB, frequent updates, multiple contributors), the upgrade path is Neon + Drizzle. Not before.

---

## Dev tooling

### @biomejs/biome

**Why**: lint + format in one tool, dramatically faster than ESLint + Prettier, sensible defaults out of the box.

**Alternatives ruled out**:
- *ESLint + Prettier* — slower, more config, two tools.
- *oxlint / oxc* — newer, less mature ecosystem.

---

## Deferred / upgrade paths

These are *not* installed now, but worth knowing the trigger conditions.

- **@tanstack/react-table** — install when the evidence workbench tab is being built. Headless, Tailwind-friendly, excellent sorting/filtering/faceting/grouping. The schema (claim, mechanism, paper, species, assay, drug, route, dose, direction, confidence, caveats) maps 1:1 to column defs. Imminent rather than speculative — likely the first dependency added after the initial three vertical slices ship. Faceted filters in particular ("only human RCT evidence at chronic dosing") are exactly its sweet spot.
- **@tanstack/react-virtual** — install when the evidence table exceeds ~100 rows or a paper archive view enters scope. Trigger is scroll jank, not preemptive.
- **@tanstack/react-ranger** — install only if the moderator dashboard needs multi-handle range sliders (e.g., "effects across dose range X to Y"). Radix's slider in shadcn covers the single-value case adequately.
- **GSAP** — install when a tab needs choreographed multi-element explanatory timelines (the Manim-replacement use case from the eng doc).
- **Lottie** (`lottie-react`) — install if you commission After Effects animations for canonical explanatory clips. Better than embedded MP4s.
- **Niivue** — install only if a tab demands real MNI-space neuroimaging anatomy. Hand-tuned SVG suffices until proven otherwise.
- **react-three-fiber + drei** — same trigger as Niivue. 3D brain meshes have a steep "looks cheap" failure mode unless you invest in proper shading/camera.
- **roughjs** — install if you decide to lean into the "field guide" aesthetic (hand-drawn edges signaling epistemic humility). Worth prototyping one tab in this mode and seeing if it lands before committing.
- **3Dmol.js** — fallback if Mol*'s bundle weight becomes a deployment problem.
- **react-hook-form + Zod resolver** — only if user-authored claim entry becomes a feature (the CodeMirror DSL path from the eng doc).
- **@uiw/react-codemirror** — if/when the authoring DSL becomes real. Defer until the static JSON pipeline proves insufficient.

---

## Explicitly not installing

- **Visx** — ruled out per your call; raw D3 instead.
- **Recharts, nivo, victory** — too generic for custom domain viz.
- **Sigma.js, vis-network** — Cytoscape covers the projection-graph case better.
- **Three.js / react-three-fiber for general use** — deferred until specific 3D need.
- **Any chemistry SMILES renderer (smiles-drawer, RDKit-js, kekule)** — peptides render as ugly sprawl from SMILES; custom SVG sequence track + Mol* for 3D is the better path.
- **Any large UI kit (Mantine, Chakra, MUI)** — fights Tailwind, brings bundle weight, fights the custom aesthetic.
- **TanStack Query** — wrong shape for this project; all data is build-time JSON via RSC, nothing to cache at runtime. Revisit only when user-state features (saved filters, annotations, sync) enter scope.
- **TanStack Router** — competes with Next.js App Router; pick one.
- **TanStack Form** — no forms in current scope; revisit if/when the CodeMirror authoring DSL becomes real.
- **TanStack Store** — already on Zustand; don't switch state libs mid-stack.
- **TanStack DB** — client-side database + sync, out of scope for static deploy.
- **TanStack Pacer** — debouncing/throttling utilities; a 5-line custom hook covers it at this scale.

---

## Approximate bundle accounting

Rough order-of-magnitude on what ships to the client (gzipped):

| Package | ~Size | Loaded |
|---|---|---|
| React + Next runtime | ~45kb | Always |
| Tailwind (purged) | ~8kb | Always |
| Radix primitives | ~15kb cumulative | Per-route |
| @xyflow/react | ~50kb | Only on graph tabs |
| Cytoscape + fcose | ~280kb | Only on projection tabs |
| D3 (tree-shaken) | ~20-40kb | Per-tab usage |
| motion | ~40kb | Always |
| animejs | ~15kb | Where used |
| @react-spring/web | ~35kb | Where used |
| molstar | ~600kb | Dynamic import only |
| zustand + nuqs | ~5kb combined | Always |

The big one is Mol* — dynamic import is mandatory. Cytoscape is the second-largest; if you find yourself only using it on one or two tabs, dynamic-import it too.

---

## File structure sketch

```
app/
  layout.tsx
  page.tsx                          # overview atlas
  mechanisms/
    [slug]/
      page.mdx                      # prose + embedded components
  evidence/page.tsx
  moderators/page.tsx
components/
  graphs/
    MechanismFlow.tsx               # React Flow
    ProjectionMap.tsx               # Cytoscape
    CrossRewardRadial.tsx           # Cytoscape + fcose
  viz/
    DopamineTrace.tsx               # raw D3
    SatietyThreshold.tsx            # raw D3
    EvidenceMatrix.tsx              # raw D3 + Tailwind
  molecular/
    PeptideSequence.tsx             # custom SVG
    MolstarViewer.tsx               # dynamic-imported Mol*
  controls/
    LensSwitcher.tsx
    StateDial.tsx                   # react-spring
    ModeratorSliders.tsx            # react-spring + nuqs
  anatomical/
    BrainSagittal.tsx               # hand-tuned SVG
    BrainCoronal.tsx
data/
  drugs.json
  mechanisms.json
  claims.json
  evidence.json
lib/
  schemas.ts                        # Zod
  stores.ts                         # Zustand
scripts/
  build-data.ts
public/
  structures/
    semaglutide.cif
```

---

## Anti-cathedral note

The design doc warned about "modeling the perfect ontology before the system helps with anything." Operational version of that warning here: install the **bold-list packages at the top**, get the three vertical slices from the eng doc working (Overview Atlas, PPG-NTS state dial, Wanting/Hedonic), and only then install the next layer. Mol* in particular should wait until the brain-access tab is actually being built — don't pre-pay 600kb of bundle weight on speculation. Everything in "Deferred / upgrade paths" should genuinely be deferred until pulled by a real tab.
