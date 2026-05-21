// Zod schemas — the single source of truth for the claim/evidence graph.
//
// Per docs/02-engineering-design.md: data integrity is enforced by the type
// system, not by convention. A claim without confidence is an error. A
// decorative edge (no backing claim) is an error. These schemas, plus the
// referential checks in `validateGraph`, give the courtroom invariants teeth.

import { z } from 'zod'

// ── Controlled vocabularies ─────────────────────────────────────────────────

export const Confidence = z.enum([
  'strong',
  'moderate',
  'speculative',
  'contradicted',
  'open',
])
export type Confidence = z.infer<typeof Confidence>

export const Polarity = z.enum(['supports', 'weakens', 'contradicts', 'modulates'])
export type Polarity = z.infer<typeof Polarity>

export const Species = z.enum(['human', 'nhp', 'rat', 'mouse', 'cell'])
export type Species = z.infer<typeof Species>

export const Route = z.enum([
  'periph_tx', // peripheral, therapeutic dose
  'periph_ex', // peripheral, experimental dose
  'icv', // central, intracerebroventricular
  'parenchymal', // central, intraparenchymal microinjection
  'ex_vivo',
  'oral',
])
export type Route = z.infer<typeof Route>

export const Chronicity = z.enum(['acute', 'subacute', 'chronic'])
export type Chronicity = z.infer<typeof Chronicity>

export const Direction = z.enum([
  'increase',
  'decrease',
  'no_change',
  'biphasic',
  'mixed',
])
export type Direction = z.infer<typeof Direction>

export const NodeKind = z.enum(['drug', 'endogenous', 'access', 'region', 'outcome'])
export type NodeKind = z.infer<typeof NodeKind>

// ── Core entities ───────────────────────────────────────────────────────────

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'lastReviewed must be an ISO date (YYYY-MM-DD)')

export const Paper = z.object({
  id: z.string().min(1),
  cite: z.string().min(1), // short display form, e.g. "Hendershot 2025"
  authors: z.array(z.string()).default([]),
  year: z.number().int(),
  journal: z.string().optional(),
  doi: z.string().optional(),
  note: z.string().optional(), // editorial summary, not abstract
})
export type Paper = z.infer<typeof Paper>

export const EvidenceObservation = z.object({
  id: z.string().min(1),
  paperId: z.string().min(1),
  species: Species,
  route: Route,
  chronicity: Chronicity,
  drug: z.string().min(1),
  assay: z.string().min(1),
  direction: Direction,
  dose: z.string().optional(),
  population: z.string().optional(),
  n: z.number().int().optional(),
  caveats: z.array(z.string()).default([]),
  note: z.string().optional(),
})
export type EvidenceObservation = z.infer<typeof EvidenceObservation>

// The scope strip shown on a claim card — a single representative context.
export const Scope = z.object({
  species: Species,
  route: Route,
  chronicity: Chronicity,
  drug: z.string().optional(),
  assay: z.string().optional(),
  n: z.number().int().optional(),
})
export type Scope = z.infer<typeof Scope>

export const Claim = z.object({
  id: z.string().min(1),
  statement: z.string().min(1),
  confidence: Confidence,
  polarity: Polarity,
  scope: Scope,
  evidenceIds: z.array(z.string().min(1)).min(1, 'every claim needs evidence'),
  contradicts: z.array(z.string()).default([]), // other Claim ids
  supersededBy: z.string().optional(),
  openQuestion: z.string().optional(),
  note: z.string().optional(),
  lastReviewed: isoDate,
})
export type Claim = z.infer<typeof Claim>

// ── The overview atlas graph ────────────────────────────────────────────────

export const AtlasNode = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sub: z.string().optional(),
  kind: NodeKind,
  lane: z.string().min(1), // column the node sits in, for layout + lens dimming
  x: z.number(),
  y: z.number(),
  size: z.number().optional(),
  claimIds: z.array(z.string()).default([]),
  contradiction: z.boolean().optional(),
  bidirectional: z.boolean().optional(),
})
export type AtlasNode = z.infer<typeof AtlasNode>

export const AtlasEdge = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  confidence: Confidence,
  label: z.string().optional(),
  dashed: z.boolean().optional(),
  contextNote: z.string().optional(),
  contradiction: z.boolean().optional(),
  claimIds: z.array(z.string().min(1)).min(1, 'every edge must be backed by a claim'),
})
export type AtlasEdge = z.infer<typeof AtlasEdge>

export const AtlasGraph = z.object({
  nodes: z.array(AtlasNode).min(1),
  edges: z.array(AtlasEdge),
})
export type AtlasGraph = z.infer<typeof AtlasGraph>

// ── The full validated dataset ──────────────────────────────────────────────

export const Dataset = z.object({
  papers: z.array(Paper),
  evidence: z.array(EvidenceObservation),
  claims: z.array(Claim),
  atlas: AtlasGraph,
})
export type Dataset = z.infer<typeof Dataset>

// ── Referential integrity ───────────────────────────────────────────────────
//
// Zod validates shape; this validates that the graph closes. Both the runtime
// loader and `scripts/validate-graph.ts` run it, so a broken reference fails
// the build, not the page.

export function validateGraph(data: Dataset): string[] {
  const errors: string[] = []
  const paperIds = new Set(data.papers.map((p) => p.id))
  const evidenceIds = new Set(data.evidence.map((e) => e.id))
  const claimIds = new Set(data.claims.map((c) => c.id))
  const nodeIds = new Set(data.atlas.nodes.map((n) => n.id))

  const dup = (label: string, ids: string[]) => {
    const seen = new Set<string>()
    for (const id of ids) {
      if (seen.has(id)) errors.push(`${label}: duplicate id "${id}"`)
      seen.add(id)
    }
  }
  dup('papers', data.papers.map((p) => p.id))
  dup('evidence', data.evidence.map((e) => e.id))
  dup('claims', data.claims.map((c) => c.id))
  dup('atlas.nodes', data.atlas.nodes.map((n) => n.id))
  dup('atlas.edges', data.atlas.edges.map((e) => e.id))

  for (const e of data.evidence) {
    if (!paperIds.has(e.paperId))
      errors.push(`evidence "${e.id}" references unknown paper "${e.paperId}"`)
  }

  for (const c of data.claims) {
    for (const eid of c.evidenceIds) {
      if (!evidenceIds.has(eid))
        errors.push(`claim "${c.id}" references unknown evidence "${eid}"`)
    }
    for (const cid of c.contradicts) {
      if (!claimIds.has(cid))
        errors.push(`claim "${c.id}" contradicts unknown claim "${cid}"`)
    }
    if (c.supersededBy && !claimIds.has(c.supersededBy))
      errors.push(`claim "${c.id}" superseded by unknown claim "${c.supersededBy}"`)
    // Invariant: a contradicted claim must name what contradicts it.
    if (c.confidence === 'contradicted' && c.contradicts.length === 0)
      errors.push(
        `claim "${c.id}" has confidence "contradicted" but no contradicts[] reference`,
      )
  }

  for (const n of data.atlas.nodes) {
    for (const cid of n.claimIds) {
      if (!claimIds.has(cid))
        errors.push(`atlas node "${n.id}" references unknown claim "${cid}"`)
    }
  }

  for (const e of data.atlas.edges) {
    if (!nodeIds.has(e.from))
      errors.push(`atlas edge "${e.id}" references unknown node "${e.from}"`)
    if (!nodeIds.has(e.to))
      errors.push(`atlas edge "${e.id}" references unknown node "${e.to}"`)
    for (const cid of e.claimIds) {
      if (!claimIds.has(cid))
        errors.push(`atlas edge "${e.id}" references unknown claim "${cid}"`)
    }
  }

  return errors
}

// ── PPG-NTS module ──────────────────────────────────────────────────────────
//
// Mechanism-specific visualisation data for the PPG-NTS state machine. Kept
// separate from the core Dataset: the claim graph is stable, mechanism modules
// churn. Per-state recruitment numbers are a qualitative model; the claim ids
// are the evidentiary backing and must resolve.

export const PpgNtsState = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  glyph: z.string().min(1),
  note: z.string().min(1),
  activity: z.number().min(0).max(1), // NTS recruitment, 0..1
  pharm: z.boolean().optional(),
  prose: z.string().min(1),
  aside: z.string().optional(),
  claimIds: z.array(z.string().min(1)).min(1),
})
export type PpgNtsState = z.infer<typeof PpgNtsState>

export const PpgNtsTarget = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sub: z.string().min(1),
  x: z.number(),
  y: z.number(),
  byState: z.array(z.number().min(0).max(1)), // one entry per state
})
export type PpgNtsTarget = z.infer<typeof PpgNtsTarget>

export const PpgNtsModule = z.object({
  states: z.array(PpgNtsState).min(2),
  targets: z.array(PpgNtsTarget).min(1),
})
export type PpgNtsModule = z.infer<typeof PpgNtsModule>

/** Each target's byState array must align with states; claim ids must resolve. */
export function validatePpgNts(
  module: PpgNtsModule,
  knownClaimIds: Set<string>,
): string[] {
  const errors: string[] = []
  const n = module.states.length

  for (const s of module.states) {
    for (const cid of s.claimIds) {
      if (!knownClaimIds.has(cid))
        errors.push(`ppg-nts state "${s.id}" references unknown claim "${cid}"`)
    }
  }
  for (const t of module.targets) {
    if (t.byState.length !== n)
      errors.push(
        `ppg-nts target "${t.id}" has ${t.byState.length} byState entries, expected ${n}`,
      )
  }
  return errors
}

// ── Wanting / hedonic-tone module ───────────────────────────────────────────
//
// The Berridge decomposition (wanting / liking / learning / effort), the
// Kooji-vs-canonical contradiction, the phenomenology snippet, and the toy
// motivational model. Confidence is per component; the `wanting` row and the
// tension pair link to real claims.

export const BerridgeDirection = z.enum(['down', 'flat', 'unknown'])
export type BerridgeDirection = z.infer<typeof BerridgeDirection>

export const BerridgeRow = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  direction: BerridgeDirection,
  effect: z.number().min(0).max(1), // magnitude of the reduction, 0..1
  confidence: Confidence,
  note: z.string().min(1),
  claimId: z.string().optional(),
})
export type BerridgeRow = z.infer<typeof BerridgeRow>

export const PhenomFit = z.object({
  label: z.string().min(1),
  weight: z.number().min(0).max(1),
  note: z.string().min(1),
})
export type PhenomFit = z.infer<typeof PhenomFit>

export const WantingModule = z.object({
  berridge: z.array(BerridgeRow).min(1),
  tension: z.object({
    leftClaimId: z.string().min(1),
    rightClaimId: z.string().min(1),
    label: z.string().min(1),
    note: z.string().min(1),
  }),
  phenomenology: z.object({
    report: z.string().min(1),
    fits: z.array(PhenomFit).min(1),
  }),
  openQuestions: z.array(z.string().min(1)).min(1),
  toyModel: z.object({
    wanting: z.number().min(0).max(1),
    liking: z.number().min(0).max(1),
    effort: z.number().min(0).max(1),
  }),
})
export type WantingModule = z.infer<typeof WantingModule>

/** Claim ids in the Berridge rows and the tension pair must resolve. */
export function validateWanting(
  module: WantingModule,
  knownClaimIds: Set<string>,
): string[] {
  const errors: string[] = []
  for (const r of module.berridge) {
    if (r.claimId && !knownClaimIds.has(r.claimId))
      errors.push(`wanting berridge row "${r.key}" references unknown claim "${r.claimId}"`)
  }
  for (const side of ['leftClaimId', 'rightClaimId'] as const) {
    const id = module.tension[side]
    if (!knownClaimIds.has(id))
      errors.push(`wanting tension.${side} references unknown claim "${id}"`)
  }
  return errors
}

// ── Cross-reward module ─────────────────────────────────────────────────────
//
// The evidence-graded radial map. Each reward domain carries an overall
// confidence — which ring of the radial it sits on — and a four-tier evidence
// matrix (preclinical / human RCT / observational / mechanism). The slice
// exists to make overgeneralisation visible: confidence must track domain, so
// food and alcohol read as firm while gambling reads as open. `absent` is a
// distinct matrix grade — "no studies" is not the same as "studied, open".

export const MatrixGrade = z.enum([
  'strong',
  'moderate',
  'speculative',
  'open',
  'absent',
])
export type MatrixGrade = z.infer<typeof MatrixGrade>

export const CrossRewardMatrix = z.object({
  preclinical: MatrixGrade,
  humanRct: MatrixGrade,
  observational: MatrixGrade,
  mechanism: MatrixGrade,
})
export type CrossRewardMatrix = z.infer<typeof CrossRewardMatrix>

export const CrossRewardDomain = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sub: z.string().min(1),
  confidence: Confidence, // overall best-evidence grade — sets the radial ring
  angle: z.number(), // degrees clockwise from straight up; fixed layout
  proximal: z.boolean().optional(), // the proximate evolutionary target (food)
  synthesis: z.string().min(1),
  matrix: CrossRewardMatrix,
  claimIds: z.array(z.string().min(1)).min(1),
})
export type CrossRewardDomain = z.infer<typeof CrossRewardDomain>

export const CrossRewardModule = z.object({
  hub: z.object({
    note: z.string().min(1),
    claimIds: z.array(z.string().min(1)).min(1),
  }),
  domains: z.array(CrossRewardDomain).min(2),
  caution: z.string().min(1), // the overgeneralisation caution
})
export type CrossRewardModule = z.infer<typeof CrossRewardModule>

/** Every claim id in the hub and the domains must resolve. */
export function validateCrossReward(
  module: CrossRewardModule,
  knownClaimIds: Set<string>,
): string[] {
  const errors: string[] = []
  for (const cid of module.hub.claimIds) {
    if (!knownClaimIds.has(cid))
      errors.push(`cross-reward hub references unknown claim "${cid}"`)
  }
  for (const d of module.domains) {
    for (const cid of d.claimIds) {
      if (!knownClaimIds.has(cid))
        errors.push(`cross-reward domain "${d.id}" references unknown claim "${cid}"`)
    }
  }
  return errors
}

// ── Aversive-affect / stress-axis module ────────────────────────────────────
//
// The aversive branch of GLP-1 signalling — the corrective to a dopamine
// monoculture. Two structural facts the module makes visible: (1) PVN and CeA
// dissociate — PVN drives the HPA axis without anxiety, CeA drives anxiety
// without the HPA axis; (2) the affective sign is regime-dependent — acute
// central rodent dosing is anxiogenic, chronic peripheral human dosing is
// neutral-to-favourable. `drives` is a qualitative model; the claim ids are
// the evidentiary backing and must resolve.

export const AffectiveSign = z.enum(['anxiogenic', 'mixed', 'favourable'])
export type AffectiveSign = z.infer<typeof AffectiveSign>

export const AversiveRegion = z.object({
  id: z.string().min(1), // 'pvn' | 'cea' | 'bnst' — the diagram keys layout off this
  label: z.string().min(1),
  sub: z.string().min(1),
  drives: z.object({
    hpa: z.number().min(0).max(1), // HPA-axis activation
    anxiety: z.number().min(0).max(1), // anxiety-like behaviour
  }),
  outcome: z.string().min(1),
  note: z.string().min(1),
  claimIds: z.array(z.string().min(1)).min(1),
})
export type AversiveRegion = z.infer<typeof AversiveRegion>

export const AversiveRegime = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  scope: Scope,
  sign: AffectiveSign,
  signNote: z.string().min(1),
  prose: z.string().min(1),
  claimIds: z.array(z.string().min(1)).min(1),
})
export type AversiveRegime = z.infer<typeof AversiveRegime>

export const AversiveChannel = z.object({
  label: z.string().min(1),
  phrase: z.string().min(1),
  note: z.string().min(1),
  claimId: z.string().optional(),
})
export type AversiveChannel = z.infer<typeof AversiveChannel>

export const AversiveModule = z.object({
  source: z.object({
    label: z.string().min(1),
    sub: z.string().min(1),
    note: z.string().min(1),
  }),
  regions: z.array(AversiveRegion).min(2),
  regimes: z.array(AversiveRegime).min(2),
  contrast: z.object({
    wanting: AversiveChannel,
    aversion: AversiveChannel,
    note: z.string().min(1),
  }),
  openQuestions: z.array(z.string().min(1)).min(1),
})
export type AversiveModule = z.infer<typeof AversiveModule>

/** Claim ids in the regions, regimes, and contrast channels must resolve. */
export function validateAversive(
  module: AversiveModule,
  knownClaimIds: Set<string>,
): string[] {
  const errors: string[] = []
  for (const r of module.regions) {
    for (const cid of r.claimIds) {
      if (!knownClaimIds.has(cid))
        errors.push(`aversive region "${r.id}" references unknown claim "${cid}"`)
    }
  }
  for (const r of module.regimes) {
    for (const cid of r.claimIds) {
      if (!knownClaimIds.has(cid))
        errors.push(`aversive regime "${r.id}" references unknown claim "${cid}"`)
    }
  }
  for (const side of ['wanting', 'aversion'] as const) {
    const id = module.contrast[side].claimId
    if (id && !knownClaimIds.has(id))
      errors.push(`aversive contrast.${side} references unknown claim "${id}"`)
  }
  return errors
}

// ── Brain-access / relay module ─────────────────────────────────────────────
//
// How a peripheral peptide drug reaches the brain at all. The module exists to
// dissolve one misconception: brain effect does not imply broad brain
// penetration. GLP-1RAs reach a circumscribed set of nodes through three
// graded routes — circumventricular/tanycyte direct access, slow adsorptive
// transcytosis, and vagal afferent relay — and the deep limbic GLP-1R sites
// are reached only second-order. `share` is a qualitative model of how much of
// the central signal each route carries; the claim ids are the evidentiary
// backing and must resolve. Peptide `mods` are indexed into `sequence`.

// portal     — node sits outside the BBB; drug binds it directly
// transit    — node reached only by slow, drug-specific adsorptive transcytosis
// projection — deep limbic node, reached second-order via projections
export const AccessTier = z.enum(['portal', 'transit', 'projection'])
export type AccessTier = z.infer<typeof AccessTier>

export const Glp1rDensity = z.enum(['high', 'moderate', 'low'])
export type Glp1rDensity = z.infer<typeof Glp1rDensity>

export const AccessRoute = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sub: z.string().min(1),
  share: z.number().min(0).max(1), // qualitative portion of the central signal
  drugEnters: z.boolean(), // does the drug itself cross, or only the signal?
  prose: z.string().min(1),
  claimIds: z.array(z.string().min(1)).min(1),
})
export type AccessRoute = z.infer<typeof AccessRoute>

export const AccessRegion = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sub: z.string().min(1),
  tier: AccessTier,
  glp1r: Glp1rDensity,
  x: z.number(),
  y: z.number(),
  routeId: z.string().optional(), // the route that reaches a portal node
  note: z.string().min(1),
})
export type AccessRegion = z.infer<typeof AccessRegion>

export const PeptideMod = z.object({
  at: z.number().int().min(0), // 0-based residue index into sequence[]
  kind: z.enum(['acylation', 'substitution', 'extension']),
  label: z.string().min(1),
  detail: z.string().min(1),
})
export type PeptideMod = z.infer<typeof PeptideMod>

export const AccessDrug = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  klass: z.string().min(1),
  entry: z.enum(['native', 'appreciable', 'slow', 'minimal', 'engineered']),
  entryNote: z.string().min(1),
  backbone: z.string().min(1), // e.g. "GLP-1(7-37)" or "exendin-4"
  sequence: z.array(z.string().min(1)).min(2), // residue codes
  mods: z.array(PeptideMod).default([]),
  claimIds: z.array(z.string().min(1)).min(1),
})
export type AccessDrug = z.infer<typeof AccessDrug>

export const AccessModule = z.object({
  correction: z.object({
    headline: z.string().min(1),
    prose: z.string().min(1),
    claimIds: z.array(z.string().min(1)).min(1),
  }),
  routes: z.array(AccessRoute).min(2),
  regions: z.array(AccessRegion).min(2),
  drugs: z.array(AccessDrug).min(2),
  structure: z.object({
    pdbId: z.string().min(1),
    file: z.string().min(1),
    label: z.string().min(1),
    caption: z.string().min(1),
    credit: z.string().min(1),
  }),
  openQuestions: z.array(z.string().min(1)).min(1),
})
export type AccessModule = z.infer<typeof AccessModule>

/**
 * Claim ids in the correction, routes, and drugs must resolve; a region's
 * routeId must name a real route; every peptide modification must index a
 * residue that exists.
 */
export function validateAccess(
  module: AccessModule,
  knownClaimIds: Set<string>,
): string[] {
  const errors: string[] = []
  const routeIds = new Set(module.routes.map((r) => r.id))

  for (const cid of module.correction.claimIds) {
    if (!knownClaimIds.has(cid))
      errors.push(`access correction references unknown claim "${cid}"`)
  }
  for (const r of module.routes) {
    for (const cid of r.claimIds) {
      if (!knownClaimIds.has(cid))
        errors.push(`access route "${r.id}" references unknown claim "${cid}"`)
    }
  }
  for (const region of module.regions) {
    if (region.routeId && !routeIds.has(region.routeId))
      errors.push(`access region "${region.id}" names unknown route "${region.routeId}"`)
  }
  for (const d of module.drugs) {
    for (const cid of d.claimIds) {
      if (!knownClaimIds.has(cid))
        errors.push(`access drug "${d.id}" references unknown claim "${cid}"`)
    }
    for (const m of d.mods) {
      if (m.at >= d.sequence.length)
        errors.push(
          `access drug "${d.id}" modification "${m.label}" indexes residue ${m.at}, ` +
            `out of range (sequence length ${d.sequence.length})`,
        )
    }
  }
  return errors
}

// ── Appetite & meal-termination module ──────────────────────────────────────
//
// The standard-explainer surface. Most accounts of "how GLP-1 drugs work" stop
// at the gut → brainstem → hypothalamus satiety cascade — and the cascade is
// real. This module renders it, and renders equally what it leaves out. The
// meal-termination curve carries the central honesty: a satiation signal
// accumulates over a meal, the meal ends when it crosses a satiety threshold,
// and pushed harder the same curve crosses an aversion threshold — nausea and
// meal-stopping are points on one substrate, not two mechanisms. `gain` and
// the threshold values are a qualitative model; claim ids are the evidentiary
// backing and must resolve.

export const AppetiteTier = z.enum([
  'gut',
  'relay',
  'brainstem',
  'hypothalamus',
  'outcome',
])
export type AppetiteTier = z.infer<typeof AppetiteTier>

export const AppetiteStage = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sub: z.string().min(1),
  tier: AppetiteTier,
  note: z.string().min(1),
  claimIds: z.array(z.string().min(1)).min(1),
})
export type AppetiteStage = z.infer<typeof AppetiteStage>

export const AppetiteEdge = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  note: z.string().optional(),
})
export type AppetiteEdge = z.infer<typeof AppetiteEdge>

export const AppetiteRegime = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  gain: z.number().min(0).max(1), // satiation-signal accumulation rate
  scope: Scope,
  prose: z.string().min(1),
  claimIds: z.array(z.string().min(1)).min(1),
})
export type AppetiteRegime = z.infer<typeof AppetiteRegime>

// What the standard explainer leaves out — each gap names the module that
// addresses it, so "visibly incomplete" is structure rather than an apology.
export const AppetiteGap = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sub: z.string().min(1),
  path: z.string().min(1), // route of the module that addresses the gap
  note: z.string().min(1),
  claimId: z.string().optional(),
})
export type AppetiteGap = z.infer<typeof AppetiteGap>

export const AppetiteModule = z.object({
  thresholds: z.object({
    satiety: z.number().min(0).max(1),
    aversion: z.number().min(0).max(1),
  }),
  baseline: z.object({
    label: z.string().min(1),
    gain: z.number().min(0).max(1),
    note: z.string().min(1),
  }),
  cascade: z.object({
    stages: z.array(AppetiteStage).min(2),
    edges: z.array(AppetiteEdge),
  }),
  regimes: z.array(AppetiteRegime).min(2),
  gaps: z.array(AppetiteGap).min(2),
  openQuestions: z.array(z.string().min(1)).min(1),
})
export type AppetiteModule = z.infer<typeof AppetiteModule>

/**
 * Cascade edges must reference real stages; stage, regime, and gap claim ids
 * must resolve; the aversion threshold must sit above the satiety threshold —
 * if it did not, the curve's two-threshold story would be incoherent.
 */
export function validateAppetite(
  module: AppetiteModule,
  knownClaimIds: Set<string>,
): string[] {
  const errors: string[] = []
  const stageIds = new Set(module.cascade.stages.map((s) => s.id))

  for (const s of module.cascade.stages) {
    for (const cid of s.claimIds) {
      if (!knownClaimIds.has(cid))
        errors.push(`appetite stage "${s.id}" references unknown claim "${cid}"`)
    }
  }
  for (const e of module.cascade.edges) {
    if (!stageIds.has(e.from))
      errors.push(`appetite cascade edge references unknown stage "${e.from}"`)
    if (!stageIds.has(e.to))
      errors.push(`appetite cascade edge references unknown stage "${e.to}"`)
  }
  for (const r of module.regimes) {
    for (const cid of r.claimIds) {
      if (!knownClaimIds.has(cid))
        errors.push(`appetite regime "${r.id}" references unknown claim "${cid}"`)
    }
  }
  for (const g of module.gaps) {
    if (g.claimId && !knownClaimIds.has(g.claimId))
      errors.push(`appetite gap "${g.id}" references unknown claim "${g.claimId}"`)
  }
  if (module.thresholds.aversion <= module.thresholds.satiety)
    errors.push('appetite thresholds: aversion must sit above satiety')
  return errors
}

// ── Neuroimmune / insulin / cognition module ────────────────────────────────
//
// The hype-control surface. Its object is the translation ladder: a hypothesis
// climbs from cell to rodent to human-observational to randomised trial, and
// each rung must be re-earned — evidence at a lower rung does not propagate
// upward. The module's anchor is EVOKE: a cognition hypothesis with three
// encouraging rungs that the adjudicating trial did not confirm. The ladder
// makes two distinctions structural — a *refuted* top rung is not an *untested*
// one, and a firm lower rung licenses nothing above it. Grades are a curated
// reading of the literature; the claim ids are the evidentiary backing and
// must resolve.

export const LadderGrade = z.enum([
  'supportive', // this rung's evidence supports the hypothesis
  'mixed', // this rung's evidence is genuinely split
  'preliminary', // early or thin evidence, leaning supportive
  'untested', // no evidence occupies this rung — distinct from a failed test
  'refuted', // this rung's evidence contradicts the hypothesis
])
export type LadderGrade = z.infer<typeof LadderGrade>

// A fixed tier of the ladder — cell, rodent, observational, RCT. The order of
// `rungs` in the module is the ladder, bottom (bench) to top (clinic).
export const LadderRung = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sub: z.string().min(1),
  establishes: z.string().min(1), // what evidence at this tier can show
  limit: z.string().min(1), // what it cannot show
})
export type LadderRung = z.infer<typeof LadderRung>

// One track's standing at one rung.
export const TrackStep = z.object({
  rungId: z.string().min(1),
  grade: LadderGrade,
  note: z.string().min(1),
  claimIds: z.array(z.string().min(1)).default([]),
})
export type TrackStep = z.infer<typeof TrackStep>

export const NeuroimmuneTrack = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sub: z.string().min(1),
  hypothesis: z.string().min(1), // the one-sentence claim being laddered
  verdict: z.string().min(1),
  anchor: z.boolean().optional(), // the EVOKE cognition track
  steps: z.array(TrackStep).min(2), // one per rung, in ladder order
})
export type NeuroimmuneTrack = z.infer<typeof NeuroimmuneTrack>

export const NeuroimmuneModule = z.object({
  rungs: z.array(LadderRung).min(2),
  tracks: z.array(NeuroimmuneTrack).min(2),
  anchor: z.object({
    headline: z.string().min(1),
    prose: z.string().min(1),
    claimIds: z.array(z.string().min(1)).min(1),
  }),
  unstudied: z.object({
    headline: z.string().min(1),
    prose: z.string().min(1),
    claimId: z.string().min(1),
  }),
  openQuestions: z.array(z.string().min(1)).min(1),
})
export type NeuroimmuneModule = z.infer<typeof NeuroimmuneModule>

/**
 * Every track's steps must cover the declared rungs exactly once, in ladder
 * order — a track that skipped a rung could not be drawn honestly. Step,
 * anchor, and unstudied claim ids must resolve.
 */
export function validateNeuroimmune(
  module: NeuroimmuneModule,
  knownClaimIds: Set<string>,
): string[] {
  const errors: string[] = []
  const rungIds = module.rungs.map((r) => r.id)
  const rungIdSet = new Set(rungIds)
  if (rungIdSet.size !== rungIds.length)
    errors.push('neuroimmune rungs: duplicate rung id')

  for (const t of module.tracks) {
    for (const s of t.steps) {
      if (!rungIdSet.has(s.rungId))
        errors.push(`neuroimmune track "${t.id}" step references unknown rung "${s.rungId}"`)
      for (const cid of s.claimIds) {
        if (!knownClaimIds.has(cid))
          errors.push(`neuroimmune track "${t.id}" step "${s.rungId}" references unknown claim "${cid}"`)
      }
    }
    const stepRungs = t.steps.map((s) => s.rungId)
    if (
      stepRungs.length !== rungIds.length ||
      stepRungs.some((r, i) => r !== rungIds[i])
    )
      errors.push(
        `neuroimmune track "${t.id}" steps must cover every rung exactly once, in ladder order`,
      )
  }

  for (const cid of module.anchor.claimIds) {
    if (!knownClaimIds.has(cid))
      errors.push(`neuroimmune anchor references unknown claim "${cid}"`)
  }
  if (!knownClaimIds.has(module.unstudied.claimId))
    errors.push(`neuroimmune unstudied references unknown claim "${module.unstudied.claimId}"`)

  return errors
}

// ── Moderators module ───────────────────────────────────────────────────────
//
// The qualitative sensitivity simulator. Seven moderator dimensions — dose,
// route, chronicity, species, sex, baseline state, molecule — each project a
// set of additive deltas onto a small number of effect channels, plus a
// fragility weight that degrades translation confidence. The dashboard is
// explicitly *not* a quantitative predictor: it makes visible how the same
// molecule reconfigures across regimes, and where the claim graph simply does
// not stratify (sex, baseline state are `grounded: false`). Channel claim ids
// are the evidentiary backing and must resolve.

export const ChannelKind = z.enum(['therapeutic', 'adverse', 'signed'])
export type ChannelKind = z.infer<typeof ChannelKind>

export const ModeratorOption = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  note: z.string().min(1),
  // per-channel additive contributions; channels not named contribute 0
  deltas: z.record(z.string(), z.number()).default({}),
  // how much this option degrades translation confidence, 0..1
  fragility: z.number().min(0).max(1),
  // substrings matched against a claim's scope.drug, for molecule options
  match: z.array(z.string().min(1)).optional(),
})
export type ModeratorOption = z.infer<typeof ModeratorOption>

export const ModeratorDimension = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sub: z.string().min(1),
  // whether the claim graph stratifies on this dimension at all
  grounded: z.boolean(),
  options: z.array(ModeratorOption).min(2),
})
export type ModeratorDimension = z.infer<typeof ModeratorDimension>

export const ModeratorChannel = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sub: z.string().min(1),
  kind: ChannelKind,
  baseline: z.number().min(-1).max(1),
  positive: z.string().min(1),
  negative: z.string().min(1),
  claimIds: z.array(z.string().min(1)).min(1),
})
export type ModeratorChannel = z.infer<typeof ModeratorChannel>

export const ModeratorPreset = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  note: z.string().min(1),
  set: z.record(z.string(), z.string()), // dimension id → option id
})
export type ModeratorPreset = z.infer<typeof ModeratorPreset>

export const ModeratorsModule = z.object({
  dimensions: z.array(ModeratorDimension).min(2),
  channels: z.array(ModeratorChannel).min(2),
  presets: z.array(ModeratorPreset).min(1),
  openQuestions: z.array(z.string().min(1)).min(1),
})
export type ModeratorsModule = z.infer<typeof ModeratorsModule>

/**
 * Option deltas must name real channels; channel claim ids must resolve; every
 * preset must set every dimension to one of that dimension's options.
 */
export function validateModerators(
  module: ModeratorsModule,
  knownClaimIds: Set<string>,
): string[] {
  const errors: string[] = []
  const channelIds = new Set(module.channels.map((c) => c.id))

  for (const dim of module.dimensions) {
    const optionIds = new Set(dim.options.map((o) => o.id))
    if (optionIds.size !== dim.options.length)
      errors.push(`moderators dimension "${dim.id}": duplicate option id`)
    for (const opt of dim.options) {
      for (const chId of Object.keys(opt.deltas)) {
        if (!channelIds.has(chId))
          errors.push(
            `moderators option "${dim.id}/${opt.id}" delta names unknown channel "${chId}"`,
          )
      }
    }
  }

  for (const ch of module.channels) {
    for (const cid of ch.claimIds) {
      if (!knownClaimIds.has(cid))
        errors.push(`moderators channel "${ch.id}" references unknown claim "${cid}"`)
    }
  }

  for (const preset of module.presets) {
    for (const dim of module.dimensions) {
      const chosen = preset.set[dim.id]
      if (chosen === undefined) {
        errors.push(`moderators preset "${preset.id}" does not set dimension "${dim.id}"`)
        continue
      }
      if (!dim.options.some((o) => o.id === chosen))
        errors.push(
          `moderators preset "${preset.id}" sets "${dim.id}" to unknown option "${chosen}"`,
        )
    }
  }

  return errors
}
