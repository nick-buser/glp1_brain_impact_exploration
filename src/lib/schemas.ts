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
