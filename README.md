# GLP-1 Brain Mechanism Atlas

An interactive mechanism atlas for the GLP-1 receptor agonist literature —
a workbench over a moving literature, not a review article. Built as a
publicly hosted learning artifact: an example of one way to make a
contested, multi-mechanism biomedical body of evidence *cognitively
inhabitable* — visible enough to orient, manipulable enough to reason with,
grounded enough to resist hype, and structured enough to keep improving as
the evidence changes.

The atlas is opinionated about register. It is not a chatbot, not a medical
advice tool, not a literature search engine, not a dashboard, and not a
"what Ozempic does" explainer. It is a substrate for thinking — claims with
provenance and scope conditions, mechanisms as graphs, contradictions
rendered as structure, and a lens system that re-projects the same data
rather than swapping pages.

## Why this exists

The GLP-1RA literature is one of the most consequential pieces of
contemporary neuropharmacology and one of the most badly served by the
registers in which it currently circulates:

- Pop-science flattens it: *"Ozempic makes dopamine go down."*
- Review articles fog it: forty pages of hedged prose, no structural
  anchor.
- Pharmacovigilance simplifies it: FAERS signal → EMA review → headline.
- Clinical phenomenology disconnects it from mechanism: *"Ozempic
  personality."*

Each register collapses lenses the literature actually requires the reader
to hold separately: rodent central acute is not human peripheral chronic;
wanting is not liking; satiety is not aversive interoception;
observational EHR signal is not RCT outcome; receptor anatomy is not BBB
pharmacokinetics is not circuit-level mechanism. The literature looks
more contested than it is, and is more nuanced than any single register
admits.

The atlas exists to make that nuance inhabitable — to give a reader a
structure they can hold, manipulate, return to, and update as the evidence
moves. The deeper motivation, design philosophy, and success/failure
conditions live in [`docs/04-vision-statement.md`](docs/04-vision-statement.md).

## What's in the artifact

Thirteen sections, sequenced in `src/lib/sections.ts`:

| # | Route | Section |
|---|---|---|
| 00 | `/` | **Overview Atlas** — the whole GLP-1 brain system at once, with six lenses (mechanistic / anatomical / evidence / uncertainty / phenomenology / moderator) that re-project the same graph |
| 01 | `/mechanisms/access` | **Brain Access** — how a peripheral peptide drug reaches the brain at all (circumventricular organs, vagal afferents, sparse parenchymal) |
| 02 | `/mechanisms/ppg-nts` | **Native GLP-1 / PPG-NTS** — what central GLP-1 normally does: a phasic satiety/aversion signal |
| 03 | `/mechanisms/appetite` | **Appetite & Meal Termination** — the satiety cascade as the standard explainer, plus the threshold model of meal termination → aversion |
| 04 | `/mechanisms/wanting` | **Mesolimbic Wanting** — the Berridge decomposition, the Kooji photometry contradiction, and a toy motivational model |
| 05 | `/mechanisms/cross-reward` | **Cross-Reward Craving** — why a metabolic drug touches alcohol, nicotine, and other rewards |
| 06 | `/mechanisms/amygdala-gaba` | **Amygdala / GABA / Aversion** — the aversive-affect branch and the HPA / stress-axis story |
| 07 | `/mechanisms/hedonic-tone` | **Hedonic Tone** — wanting vs liking vs learning vs effort |
| 08 | `/mechanisms/neuroimmune` | **Neuroimmune / Insulin / Cognition** — inflammation, central insulin signalling, plasticity |
| 09 | `/moderators` | **Moderators** — dose, route, chronicity, species, sex, molecule, baseline state |
| 10 | `/evidence` | **Evidence** — the paper table and the claim workbench |
| 11 | `/open-questions` | **Open Questions** — first-class entities, not afterthoughts |
| 12 | `/bibliography` | **Bibliography** — the full reference list behind every claim |

Each module page follows the same skeleton (module header → two-column
scroll wells → page footer carrying the workbench signature). The
two-column layout is enforced by `.page-col-2` in `src/index.css`; the
footer (`PageFooter` in `src/components/atlas.tsx`) shows the dataset's
most-recent review date, version, and claim/paper counts on every route.

## Architectural posture

The architecture is small on purpose. Five commitments do most of the
work:

1. **Data integrity is enforced by the type system, not by convention.**
   Zod schemas in `src/lib/schemas.ts` are the single source of truth; the
   build fails if any claim lacks confidence, provenance, or scope
   conditions, or if any reference dangles. See *Build gate* below.
2. **Lenses are projections, not pages.** A lens is a pure function from
   `(graph, lens-id) → visualisation`. Switching the lens re-weights the
   same graph rather than navigating to a different page. Adding a lens is
   a frontend concern; it does not require schema changes.
3. **The schema is small, typed, and stable; the surface is rich and
   evolving.** The graph layer should change rarely. The visualisation
   layer is expected to churn.
4. **Stewardship is architectural, not behavioural.** `lastReviewed` is a
   first-class field on every claim; the footer reads the dataset's
   most-recent review date and surfaces it on every page. Staleness is
   visible.
5. **Contradictions render as structure.** A `contradicted` confidence
   value plus a `contradicts: string[]` field on the `Claim` schema lets
   the UI render contradictions as paired-claim cards (see
   `src/components/PairedClaim.tsx`) rather than hide them in hedged
   prose.

What this is *not*: it is not a generic CMS, not a graph database, not a
runtime-mutable system. There is no backend. There is no user auth. All
edits to the corpus are edits to JSON files under version control, gated
by the build validator and reviewed in PRs.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Vite + React 19 + TypeScript | Static SPA; build-time JSON → typed props; no runtime data fetch |
| Router | React Router v7 | Per-route code-splitting via `lazy()`; routes own their data dependencies |
| Styling | Tailwind v4 + a small custom token system (`--bg`, `--ink-1..4`, `--accent`, `--rule`) | Utility classes work on SVG; the token system gives the light/dark "atlas" themes a single switch |
| Data integrity | Zod | One schema definition gives both the build-time validator and the editor types |
| Graphs (workbench) | `@xyflow/react` (React Flow) | Every node is a React component — needed for in-graph evidence pop-outs |
| Custom viz | Raw SVG + small bespoke components | The bespoke domain visuals (Berridge decomposition, meal-termination curve, atlas force layout) don't need a charting library |
| Animation | Framer Motion | Only where the motion carries information |
| Molecular 3D | molstar (lazy-loaded) | Quality bar set by RCSB; the ~3MB bundle is quarantined behind a dynamic import |
| Tables | `@tanstack/react-table` | The Evidence workbench is a table-graph hybrid; this handles sort/filter/headless rendering |
| Deploy | Cloudflare Pages via Wrangler | `wrangler.jsonc` configures SPA routing; static asset hosting |

Older planning docs (notably `docs/02-engineering-design.md`) mention
Next.js / MDX / Zustand / nuqs — those were the original choices.
The shipped stack is the Vite + React + React-Router-driven version
described above. Where the docs and the code disagree, the code is
canonical.

## Data model

The data model is the load-bearing piece. If the schema is honest, the
rest is presentation. If the schema cheats, no amount of polish recovers
it.

Five core entities, all defined in `src/lib/schemas.ts`:

```ts
Paper          // id, cite, authors, year, journal, doi, title, notes
EvidenceObservation
               // id, paperId, species, assay, drug, route, dose,
               //   chronicity, direction, magnitude, population,
               //   caveats, scopeNote, lastReviewed
Claim          // id, statement, polarity, confidence, scopeConditions,
               //   evidenceIds[], contradicts[], supersededBy,
               //   lastReviewed
AtlasNode      // id, kind, label  (regions, drugs, outcomes, etc.)
AtlasEdge      // id, source, target, relation, claimIds[]
```

Plus per-module aggregate schemas (`AppetiteModule`, `WantingModule`,
`AversiveModule`, …) for the bespoke surfaces that need shape beyond the
generic claim graph.

The data lives in `src/data/*.json` as hand-curated, version-controlled
files:

```
src/data/
  papers.json           the bibliography
  evidence.json         per-paper observations
  claims.json           statements with provenance, scope, confidence
  atlas.json            nodes + edges of the overview graph
  appetite.json         module-specific (the satiety cascade, regimes)
  wanting.json          module-specific (the Kooji tension, Berridge)
  cross-reward.json     …
  aversive.json         …
  neuroimmune.json      …
  moderators.json       …
  phenomenology.json    …
  access.json           …
  ppg-nts.json          …
```

### Build gate

`scripts/validate-graph.ts` runs before every production build. It loads
every JSON file, parses it through the Zod schema, and then runs the
referential-integrity checks: every claim's `evidenceIds` resolve, every
edge's `claimIds` resolve, every contradicted claim references the claim
it contradicts, every module's claim references are real, every
`lastReviewed` parses as an ISO date.

```bash
pnpm validate            # runs the gate standalone
pnpm build               # validate → tsc -b → vite build
```

A claim without confidence is a build error. A decorative edge (no
backing claim) is a build error. This is the schema's job, not the
designer's.

## Repository layout

```
src/
  App.tsx                  routes, theme, mobile gate, page-footer wiring
  main.tsx                 entry
  index.css                design tokens + global styles
  lib/
    schemas.ts             Zod schemas — single source of truth
    data.ts                validated dataset loader + exports for the UI
    sections.ts            information architecture (the route map)
    lens.ts                lens definitions + projection helpers
    {appetite,wanting,…}.ts per-module typed accessors
  data/                    hand-curated JSON (the corpus)
  pages/                   one file per route
  components/
    atlas.tsx              shared primitives (Eyebrow, ModuleHeader,
                           StewardshipPip, ClaimCard, PageFooter)
    {AtlasGraph,LensSwitcher,EvidenceWorkbench,…}.tsx
    …                      bespoke visualisations per module
scripts/
  validate-graph.ts        build-time data validator
  fetch-pdb.ts             one-shot fetcher for molstar .cif files
public/
  structures/*.cif         pre-fetched 3D structures (committed)
  favicon.svg
docs/                      product, engineering, UI/UX, vision, research
designs/                   exported design artboards (.jsx + tokens.css)
wrangler.jsonc             Cloudflare Pages deploy config
```

## Running it

Requires Node 23.6+ (for native TypeScript execution in the validator
script) and pnpm.

```bash
pnpm install
pnpm dev                 # vite dev server on :5173
pnpm validate            # run the build gate without building
pnpm build               # validate → tsc -b → vite build → ./dist
pnpm preview             # serve ./dist locally
pnpm lint                # eslint over src/
```

The dev server hot-reloads JSON edits. If you add or rename a field, the
Zod schema and the consumer site will both shout at you.

### Deploying

The artifact is a static SPA — `pnpm build` emits `./dist`. Any static
host will serve it; the bundled `wrangler.jsonc` configures Cloudflare
Pages with single-page-application not-found handling.

```bash
pnpm dlx wrangler pages deploy ./dist
```

### Fetching structures (rarely)

Molecular structures referenced by `MolstarViewer` live under
`public/structures/`. They are committed to the repo so the build is
hermetic. To refresh:

```bash
pnpm fetch:structures
```

## Documentation

The `docs/` directory carries the project's longer-form thinking. Each
file is dated by intent rather than by timestamp; the ones to read first
depend on what you want from the repo.

| File | What it is |
|---|---|
| `04-vision-statement.md` | What the atlas is, why it needs to exist, what success and failure look like. The shortest path to "do I want to engage with this?" |
| `01-prd-research-spec.md` | Product requirements + the research spec. Reads as a brief to whoever is building. |
| `02-engineering-design.md` | High-level engineering design. Pre-dates the Vite migration; the architectural commitments still apply, the framework choices don't. |
| `03-ui-ux-designer-guide.md` | The experiential telos and the failure modes of the design. Not a layout spec; a brief about what the surfaces have to *feel* like. |
| `library-plan.md` | Library and dependency rationale. Useful if you're considering a similar project and want a worked example of the trade-offs. |
| `glp1_deep_research.md` | Background synthesis on the underlying biology. The substrate the corpus is curated against. |
| `gpt_abstract_plan.md` | An early framing draft. Mainly of interest if you want to see how the project's positioning evolved. |
| `bibliography-deeplinks.md` | Feature note on the bibliography surface. |

The design artboards in `designs/` are JSX-flavoured static mockups
explored before the implementation; they are not part of the build. They
document the visual language the implementation grew from.

## If you were going to build something like this

A few moves that did most of the work:

1. **Start with the schema, not the surface.** Write the Zod schema for
   the smallest claim graph that captures your domain's actual structure
   — including the things that look like decoration (scope conditions,
   confidence, last-reviewed dates). Get someone domain-literate to
   stress-test it. Only then build the first surface.

2. **Make the build the gatekeeper.** Referential integrity, mandatory
   provenance, and stewardship dates have to be enforced by the build, or
   they will erode in the first month. A validator script that fails CI
   on a missing field is worth more than any code review discipline.

3. **Treat contradictions as structure.** Most knowledge-graph tools
   pretend contradictions don't exist. They do. Give your schema a way
   to name them, and your UI a way to render them paired. The honest
   surface is more readable than the hedged one.

4. **Pick a tight visual register and hold it.** Two fonts, one accent
   colour, a small set of design tokens (`--bg`, `--ink-1..4`, `--rule`,
   `--accent`), light/dark mode driven by a class swap. The reader's
   attention should go to the content, not the chrome.

5. **Code-split per route.** A landing page that ships every module's
   visualisations is a hostile landing page. `React.lazy()` per route
   keeps the entry bundle lean and isolates the heavy dependencies
   (`molstar`, force layouts) behind dynamic imports.

6. **Write the planning docs first, in prose.** Vision, PRD, engineering
   design, UI/UX guide. They become the test the implementation is
   measured against. They also age — when they disagree with the code,
   the code wins, but the disagreement is itself a useful signal about
   what shifted and why.

## Status and stewardship

The corpus is a curated snapshot, not an exhaustive review. Claim and
paper counts and the most-recent review date are visible at the bottom
of every page. Sections marked stale (`>90d` since `lastReviewed`) are
counted in the Overview's stewardship strip. The atlas is meant to be
tended, not finished — the schema and the build gate exist precisely so
that maintenance can be cheap.

Contributions, corrections, and counter-evidence are welcome via PRs
against `main`. Per the deepest commitment in the vision statement:
*every claim carries its confidence and its provenance; contradictions
render as structure rather than hedging; open questions are first-class
entities and not the conclusion of an article.* PRs are reviewed against
that bar.

## License

No license file is currently committed. Curated content (claims, evidence
summaries, phenomenology mappings, prose) is © the project authors;
citations to underlying papers remain with their respective publishers
under their own terms. If you want to use, fork, or quote substantively
from the source or the corpus, open an issue.
