# GLP-1 Brain Mechanism Atlas — High-Level Engineering Design

## Architectural posture

This is a content-and-interaction-heavy static web app over a hand-curated, schema-validated knowledge graph. There is no backend, no runtime database, no user auth in v1. All claim/evidence data lives in version-controlled JSON, validated against Zod schemas at build time, consumed by React Server Components and passed as props into client components that handle interactivity.

The architectural commitments are:

- **Data integrity is enforced by the type system, not by convention.** Zod schemas in `lib/schemas.ts` are the single source of truth; the build fails if any claim lacks confidence, provenance, or scope conditions. This is how the courtroom invariants get teeth.
- **Lenses are projections, not pages.** The data model supports every lens cleanly; lenses are pure functions from `(graph, context) → visualisation`. Adding a lens is a frontend concern; it does not require schema changes.
- **The schema is small, typed, and stable; the surface is rich and evolving.** The graph layer should change rarely. The viz layer is expected to churn.
- **Stewardship is architectural, not behavioural.** `last_reviewed`, `superseded_by`, and version control of the data files are first-class. The CodeMirror authoring layer is anticipated but not v1.
- **Vertical slices before horizontal completeness.** Three mechanism modules (Overview Atlas, PPG-NTS, Wanting/Hedonic) plus the claim graph proves the core affordance before the remaining nine modules are filled in.

## Tech stack summary

Full installation and trade-off rationale lives in `library-plan.md`. Headline choices:

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TS | RSC enables build-time JSON → page flow; MDX is first-class; Vercel deploy is friction-free |
| Styling | Tailwind v4 + shadcn/Radix | Utility classes work on SVG; accessible primitives without rebuilding them |
| Content | MDX (`@next/mdx`) | Prose + embedded interactive components in the same authoring surface |
| Data integrity | Zod | Runtime + build-time schema validation; the courtroom invariants get enforced |
| Graphs (workbench) | `@xyflow/react` (React Flow) | Every node is a React component — needed for evidence-panel pop-outs |
| Graphs (projection) | Cytoscape + fcose | Edge aesthetics that read as neural projections, not UML arrows |
| Custom viz | Raw D3 (computation only) | Bespoke domain visuals; React owns the DOM, D3 does math |
| Animation | motion + animejs + react-spring | Components / SVG paths / physics-coupled interaction, respectively |
| Molecular 3D | molstar (dynamic import) | Quality-of-rendering bar set by RCSB; bundle weight quarantined |
| State (UI) | Zustand | Cross-component client state without provider gymnastics |
| State (URL) | nuqs | Typed search params for shareable filtered views |
| Build pipeline | `tsx` + native fetch | Scripts in `/scripts/`, output JSON in `/data/`, no backend |

## Data model

The data model is the load-bearing piece. If the schema is honest, the rest is presentation. If the schema cheats, no amount of polish recovers it.

### Core entities

```ts
// lib/schemas.ts (sketch — Zod schemas in real implementation)

type Confidence = "strong" | "moderate" | "speculative" | "contradictory" | "open"

type Species = "human" | "non_human_primate" | "rat" | "mouse" | "cell" | "other"

type Route = "peripheral_therapeutic" | "peripheral_experimental"
            | "central_icv" | "central_intraparenchymal" | "ex_vivo"

type Chronicity = "acute_single" | "subacute" | "chronic"

type AssayClass =
  | "self_administration" | "progressive_ratio" | "conditioned_place_preference"
  | "sucrose_preference" | "elevated_plus_maze" | "microdialysis"
  | "fiber_photometry" | "fmri_cue_reactivity" | "fmri_resting_state"
  | "rct_clinical_outcome" | "ehr_cohort" | "case_report"
  | "histology_receptor_mapping" | "behavioral_other" | "other"

type Drug =
  | "semaglutide" | "liraglutide" | "exenatide" | "exendin_9_39"
  | "dulaglutide" | "tirzepatide" | "endogenous_glp1" | "other"

interface Paper {
  id: string                    // stable slug, e.g. "kooji_2024_photometry"
  authors: string[]
  year: number
  journal?: string
  doi?: string
  title: string
  notes?: string                // editorial summary, not abstract
}

interface EvidenceObservation {
  id: string
  paperId: string
  species: Species
  assay: AssayClass
  drug: Drug
  route: Route
  dose?: string                 // free text; "0.4 mg/kg s.c." etc.
  chronicity: Chronicity
  direction: "increase" | "decrease" | "no_change" | "biphasic" | "mixed"
  magnitude?: string            // free text or effect-size note
  population?: string           // "lean male SD rats", "AUD + obesity adults"
  caveats: string[]
  scopeNote?: string            // freeform context
  lastReviewed: string          // ISO date
}

interface Claim {
  id: string
  statement: string             // canonical phrasing
  mechanismIds: string[]        // a claim can belong to multiple mechanisms
  polarity: "supports" | "weakens" | "contradicts" | "modulates"
  confidence: Confidence
  evidenceIds: string[]
  contradictedBy?: string[]     // other Claim ids
  supersededBy?: string         // Claim id
  openQuestions?: string[]      // OpenQuestion ids
  scopeConditions: {
    species?: Species[]
    route?: Route[]
    chronicity?: Chronicity[]
    drug?: Drug[]
    population?: string[]
  }
  lastReviewed: string
}

interface BrainRegion {
  id: string                    // "vta", "nac_shell", "cea", ...
  name: string
  aliases: string[]
  containsGlp1r: "high" | "moderate" | "low" | "absent" | "uncertain"
  cellTypes?: string[]
  notes?: string
}

interface MechanismNode {
  id: string
  type: "region" | "drug" | "neurotransmitter" | "hormone"
       | "behaviour" | "stimulus" | "phenomenology" | "cellular_process"
  label: string
  regionId?: string             // if type === "region"
  // visualisation hints kept minimal; lenses compute layout
}

interface MechanismEdge {
  id: string
  fromNodeId: string
  toNodeId: string
  relation: "activates" | "inhibits" | "modulates" | "projects_to"
          | "associated_with" | "uncertain_direction" | "context_dependent"
  claimIds: string[]            // every edge backed by claims
  contextDependence?: {
    activeUnder: {
      route?: Route[]
      chronicity?: Chronicity[]
      species?: Species[]
    }
    note?: string
  }
}

interface Mechanism {
  id: string                    // "wanting", "ppg_nts", "hpa", ...
  title: string
  oneSentenceClaim: string
  nodes: MechanismNode[]
  edges: MechanismEdge[]
  claimIds: string[]            // mechanism-level claims beyond per-edge
  moderators: ModeratorRef[]
  coupledMechanismIds: string[]
  openQuestionIds: string[]
  lastReviewed: string
}

interface ModeratorRef {
  dimension: "dose" | "route" | "chronicity" | "species" | "sex"
           | "baseline_state" | "drug" | "assay"
  effect: string                // qualitative description
  evidenceIds: string[]
}

interface PhenomenologyMapping {
  id: string
  report: string                // "food tastes flat"
  candidateComponents: Array<{
    component: "wanting" | "liking" | "learning" | "effort"
             | "aversive_interoception" | "nausea" | "mood" | "other"
    likelihood: "high" | "moderate" | "low" | "uncertain"
    rationale: string
    mechanismIds: string[]
  }>
  caveats: string[]
}

interface OpenQuestion {
  id: string
  question: string
  mechanismIds: string[]
  whyItMatters: string
  whatWouldResolveIt: string
  relatedClaimIds: string[]
}
```

### Schema invariants enforced at build time

These run as part of `pnpm build:data` before `next build`:

1. Every `MechanismEdge.claimIds` is non-empty.
2. Every `Claim.evidenceIds` is non-empty.
3. Every `EvidenceObservation` resolves to a real `Paper`.
4. Every `Claim` has `confidence` set.
5. Every claim with `confidence: "contradictory"` has at least one `contradictedBy` reference.
6. `scopeConditions` is present (possibly empty array values, but not undefined).
7. `lastReviewed` parses as an ISO date.
8. Referenced IDs (claim → evidence, edge → claim, mechanism → claim, etc.) resolve.

A claim without confidence is a build error. A decorative arrow is a build error. This is the schema's job, not the designer's.

### Data files

```
data/
  papers.json                   # the bibliography
  evidence.json                 # EvidenceObservations
  claims.json                   # Claims
  mechanisms.json               # Mechanism aggregates with nodes/edges
  regions.json                  # BrainRegion lookup
  phenomenology.json            # PhenomenologyMappings
  open-questions.json           # OpenQuestions
  drugs.json                    # Drug metadata (sequences, modifications, structures)
```

Hand-curated initially. The schema is designed to support an authoring DSL later but does not require it.

## Data pipeline

```
/scripts/
  fetch-chembl.ts               # binding data, MoA, indications for drug records
  fetch-pubchem.ts              # canonical identifiers, structures
  fetch-pdb.ts                  # 3D structures for Mol* (CIF files → /public/structures/)
  validate-graph.ts             # runs Zod schemas across all data/*.json, fails build on violation
  build-data.ts                 # orchestrator: fetch external refs, validate, emit derived indices

# package.json
"build:data": "tsx scripts/build-data.ts",
"build": "pnpm build:data && next build"
```

External fetches run at build time, results committed to the repo. No runtime API calls. Validation is the gate; if claims-without-confidence land in a PR, CI catches it.

## Frontend architecture

### Route structure

```
app/
  layout.tsx                    # global shell, nav, lens-switcher context
  page.tsx                      # overview atlas (mechanism graph)
  mechanisms/
    [slug]/
      page.mdx                  # prose + embedded components
  evidence/
    page.tsx                    # workbench: claim/paper table-graph hybrid
    [claimId]/page.tsx          # claim detail
  moderators/
    page.tsx                    # qualitative simulator dashboard
  phenomenology/
    page.tsx                    # report → candidate mechanism mapper
  open-questions/
    page.tsx                    # aggregate open question tracker
```

Each `mechanisms/[slug]/page.mdx` follows the same skeleton: one-sentence claim, primary visual, interactive controls, evidence panel, caveats, couplings. MDX lets the prose breathe between the components without forcing a rigid template.

### Server vs client component split

- **Server components** load JSON, validate at the type boundary, pass props.
- **Client components** own all interactivity: graphs, animations, sliders, state dial, lens-switcher.
- **No data fetching in client components.** Everything they need arrives as props.

### State management

Two stores, two scopes:

**Zustand store** (`lib/stores.ts`) — client-only UI state:
- current lens mode
- evidence-layer filter
- selected drug for comparison
- moderator control values (when not URL-synced)
- expanded panels / hover state for cross-component coordination

**nuqs** — URL-synced state:
- lens mode (so a shared link reproduces the view)
- evidence-strength filter
- moderator values for the qualitative simulator
- selected claim / mechanism ID

The discipline: Zustand for transient UI state, nuqs for state that should survive a refresh and be link-shareable. Data lives in build-time JSON; neither store holds domain data.

### Visualisation component inventory

```
components/
  graphs/
    MechanismFlow.tsx            # React Flow — workbench/atlas mode
    ClaimGraph.tsx               # React Flow — evidence workbench
    ProjectionMap.tsx            # Cytoscape — anatomical projections
    CrossRewardRadial.tsx        # Cytoscape + fcose
    AmygdalaSplit.tsx            # Cytoscape — PVN/CeA dissociation
  viz/
    DopamineTrace.tsx            # raw D3 — wanting tab timeline
    SatietyThreshold.tsx         # raw D3 — appetite tab
    EvidenceMatrix.tsx           # raw D3 + Tailwind heatmap
    DecompositionBars.tsx        # raw D3 — wanting/liking/learning/effort
    TranslationLadder.tsx        # raw D3 — cell→rodent→fMRI→RCT
  molecular/
    PeptideSequence.tsx          # custom SVG — primary structure + modifications
    MolstarViewer.tsx            # dynamic-imported Mol*, lazy
  controls/
    LensSwitcher.tsx             # the most important shared control
    StateDial.tsx                # react-spring — PPG-NTS physiologic state
    ModeratorSliders.tsx         # react-spring + nuqs
    ConfidenceBadge.tsx          # shadcn/Radix-based
    ScopeBadge.tsx               # species/route/chronicity chip
  anatomical/
    BrainSagittal.tsx            # hand-tuned SVG
    BrainCoronal.tsx             # hand-tuned SVG
  evidence/
    EvidenceHoverCard.tsx        # claim provenance pop-out
    ClaimDetailPanel.tsx
    PaperReference.tsx
  phenomenology/
    PhenomenologyMapper.tsx      # report input → component decomposition
  shared/
    LensProjection.tsx           # higher-order component for lens-aware rendering
    UncertaintyOverlay.tsx
    ContradictionMarker.tsx
```

### Lens system implementation

A lens is a function:

```ts
type Lens = (graph: MechanismGraph, ctx: LensContext) => LensProjection

interface LensContext {
  mode: "anatomical" | "mechanistic" | "phenomenological"
      | "evidence" | "uncertainty" | "moderator_aware"
  moderators?: ModeratorState
  evidenceFilter?: EvidenceFilter
}
```

Each lens returns instructions for how to render the same graph: which nodes to emphasise, which edges to weight by confidence, which to dim, which to highlight as contradiction sites, etc. The `LensProjection` is consumed by the graph component (React Flow or Cytoscape), which renders accordingly.

This is the architectural commitment that makes lenses cheap to add and impossible to fake. A new lens is a pure function; if the graph supports it, the lens works. If the graph cannot support it, the lens reveals the schema gap, which is itself useful.

## Build sequencing — vertical slices first

Per the manifesto guidance against cathedrals of representation: ship three thin vertical slices that exercise the full stack before completing the horizontal mechanism inventory.

### Slice 1 — Overview Atlas + claim graph foundation

- Zod schemas finalised
- Seed `data/*.json` with ~30–50 carefully curated claims spanning all twelve mechanism domains
- Build validation pipeline (`scripts/validate-graph.ts`) running in CI
- `app/page.tsx`: React Flow global graph, custom mechanism nodes, evidence hover cards, confidence badges
- Lens switcher with two working modes (mechanistic + evidence)
- Basic claim detail page

This slice proves: the schema is right, validation works, the graph renders, lens switching is feasible, evidence provenance is visible.

### Slice 2 — PPG-NTS / native GLP-1 state machine

- The physiologic state dial (react-spring) is the centrepiece interaction
- Animated pathway showing PPG-NTS recruitment under each state (fasted → fed → large meal → stress → pharmacologic)
- The native-phasic vs pharmacologic-chronic contrast made visible
- Anatomical SVG of dorsomedullary projections

This slice proves: physics-coupled interaction works, animated mechanism storytelling works, the conceptual-heart story can be told without prose carrying everything.

### Slice 3 — Wanting / Hedonic Tone

- VTA → NAc → VP → PFC circuit (Cytoscape)
- Wanting / liking / learning / effort decomposition bars (raw D3)
- The Kooji-vs-canonical contradiction surfaced as graph structure, not prose hedging
- A toy motivational model with sliders (clearly labelled toy)

This slice proves: the most conceptually contested mechanism can be presented honestly, contradictions render as structure, the phenomenology-component decomposition is communicable.

### After the three slices

Order of subsequent work driven by which mechanism modules best stress-test remaining architectural unknowns, not by completeness. Likely next: the evidence workbench (proves the table-graph hybrid), then cross-reward (proves the evidence matrix), then HPA / amygdala-GABA, then brain access (introduces Mol*), then appetite, then neuroimmune, then moderators dashboard, then phenomenology mapper. Open-question tracker can be a thin aggregator built whenever its content density justifies it.

## Stewardship affordances

The atlas decays silently if no one is updating it. Architecture must make updating cheap.

- `lastReviewed` on every Claim, EvidenceObservation, and Mechanism.
- `supersededBy` on every Claim allows graceful deprecation without deletion.
- A `pnpm review:stale` script lists claims unreviewed in >90 days, surfacing the stewardship queue.
- The data files are version-controlled with the codebase. Every claim has a git history.
- A `STEWARDSHIP.md` at the repo root names cadences: weekly intake (new papers), monthly edge-review (claims under challenge), quarterly mechanism review (structural integrity), annual sunset (retired claims).
- The CodeMirror authoring DSL is anticipated as the eventual stewardship surface; the schema is designed so the DSL is a thin layer over typed objects rather than a parser concern. It is not v1 work.

## Performance and accessibility

**Bundle budget** (gzipped, rough):
- Initial route ≤ 120 KB JS (Next runtime + Tailwind + core React Flow when needed)
- Cytoscape routes ≤ 350 KB additional (dynamic-imported per anatomical page)
- Mol* never on initial route; dynamic import only on brain-access tab, must not load on other tabs
- Per-tab D3 imports kept tree-shaken (`import { scaleLinear } from 'd3-scale'`, not `from 'd3'`)

**Rendering discipline**:
- All custom viz: React owns the DOM, D3 owns the math. No `d3.select(...).append(...)` in component bodies.
- React Flow virtualises automatically; Cytoscape graphs kept under ~150 nodes per visualisation.
- Animations respect `prefers-reduced-motion`.

**Accessibility**:
- Radix primitives (via shadcn) give keyboard nav, focus management, ARIA out of the box.
- SVG visualisations carry semantic structure where it serves comprehension (`<title>`, `<desc>`, labelled groups).
- The atlas is dense; designers must ensure non-visual paths to the same content (claim graph as table, mechanism prose as canonical prose-readable surface).
- Colour is never the sole carrier of meaning (confidence levels, evidence species, etc., always have shape/text/iconography in parallel).

## Open engineering questions

These are real and will need decisions during build.

- **How aggressively to cache lens projections.** A naive implementation recomputes the projection on every lens or moderator change. For graphs >100 nodes this matters. Likely solution: memoise on `(graphId, lensContextHash)`; revisit if perf budget breaks.
- **Where the phenomenology mapper's "candidate components" come from.** Hand-curated mappings work for v1; the longer-term question is whether to use a structured LLM-assisted suggestion layer that surfaces candidate mappings to a steward for approval, never directly to the user. The architecture should not preclude this but the v1 surface should not depend on it.
- **CodeMirror authoring surface vs JSON editing.** Defer until the volume of stewardship justifies it (probably ~6–12 months in).
- **Mol* alternatives if bundle weight is a problem.** 3Dmol.js is the documented fallback.
- **How to express "context-dependent edge".** Current schema uses `contextDependence` on edges. Alternative: multiple parallel edges with different scope conditions. The former is more compact; the latter is more lens-friendly. Decide during Slice 1.
- **Whether to ship a search index over claims.** A FlexSearch or Lunr index over claims could enable "find all claims about CeA + chronic" queries. Useful, deferrable.
- **Sync with the broader cognitive ecosystem.** The PRD flags coupling to The Lab as out of scope; the architecture should not foreclose it. A future `lab-bridge` package could surface n=1 data against atlas predictions, but no compromises for v1.

## Anti-cathedral discipline

The library plan warns against installing infrastructure on speculation. The same applies here. The build sequence above front-loads the schema and one graph implementation. Cytoscape goes in when Slice 3 needs projection aesthetics; Mol* goes in only when the brain-access tab is being built. Every additional library should be pulled by a real surface, not pushed by architectural neatness.

If the schema turns out to be wrong, fix the schema before scaling the surface. If a vertical slice reveals a load-bearing assumption is false, stop and rework the slice before moving on. The atlas's value is honesty under load; engineering shortcuts that undermine that are not shortcuts.
