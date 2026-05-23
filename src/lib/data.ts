// Loads the build-time JSON, validates it against the Zod schemas and the
// referential-integrity checks, and exposes typed lookups + resolvers.
//
// Validation runs at module load. If the graph does not close — a claim with
// no evidence, an edge with no claim, a dangling id — this throws, and the
// app fails loudly rather than rendering a dishonest atlas. The same check
// runs in `scripts/validate-graph.ts` so CI catches it before deploy.

import {
  Dataset,
  validateGraph,
  type AtlasEdge,
  type AtlasNode,
  type Claim,
  type EvidenceObservation,
  type Paper,
} from './schemas'

import papersJson from '../data/papers.json'
import evidenceJson from '../data/evidence.json'
import claimsJson from '../data/claims.json'
import atlasJson from '../data/atlas.json'

const parsed = Dataset.safeParse({
  papers: papersJson,
  evidence: evidenceJson,
  claims: claimsJson,
  atlas: atlasJson,
})

if (!parsed.success) {
  console.error('Dataset schema validation failed:')
  console.error(parsed.error.issues)
  throw new Error('Atlas dataset failed schema validation — see console.')
}

export const dataset = parsed.data

const refErrors = validateGraph(dataset)
if (refErrors.length > 0) {
  console.error('Atlas dataset referential-integrity errors:')
  for (const e of refErrors) console.error('  · ' + e)
  throw new Error(`Atlas dataset has ${refErrors.length} integrity error(s) — see console.`)
}

// ── Indices ─────────────────────────────────────────────────────────────────

export const papersById = new Map(dataset.papers.map((p) => [p.id, p]))
export const evidenceById = new Map(dataset.evidence.map((e) => [e.id, e]))
export const claimsById = new Map(dataset.claims.map((c) => [c.id, c]))
export const nodesById = new Map(dataset.atlas.nodes.map((n) => [n.id, n]))

// ── Resolvers ───────────────────────────────────────────────────────────────

export type ResolvedEvidence = EvidenceObservation & { paper: Paper }

export type ResolvedClaim = {
  claim: Claim
  evidence: ResolvedEvidence[]
  papers: Paper[]
  contradictedBy: Claim[]
}

/** Resolve a claim to its evidence, papers, and any claims that contradict it. */
export function resolveClaim(claimId: string): ResolvedClaim | undefined {
  const claim = claimsById.get(claimId)
  if (!claim) return undefined

  const evidence: ResolvedEvidence[] = claim.evidenceIds.flatMap((eid) => {
    const ev = evidenceById.get(eid)
    if (!ev) return []
    const paper = papersById.get(ev.paperId)
    if (!paper) return []
    return [{ ...ev, paper }]
  })

  const papers = [...new Map(evidence.map((e) => [e.paper.id, e.paper])).values()]

  const contradictedBy = dataset.claims.filter((c) => c.contradicts.includes(claimId))

  return { claim, evidence, papers, contradictedBy }
}

/** All claims attached to an atlas node, resolved. */
export function claimsForNode(nodeId: string): ResolvedClaim[] {
  const node = nodesById.get(nodeId)
  if (!node) return []
  return node.claimIds.flatMap((cid) => {
    const r = resolveClaim(cid)
    return r ? [r] : []
  })
}

/** Days since a claim was last reviewed, relative to today. */
export function daysSinceReviewed(claim: Claim, now = new Date()): number {
  const reviewed = new Date(claim.lastReviewed + 'T00:00:00Z')
  return Math.floor((now.getTime() - reviewed.getTime()) / 86_400_000)
}

export const STALE_THRESHOLD_DAYS = 90

// ── Workbench signature ─────────────────────────────────────────────────────
// The atlas is explicitly framed as "a workbench over a moving literature";
// every page renders these facts in its footer so the user always knows what
// state of the dataset they are standing on.

export const DATASET_VERSION = 'v0.1'

/** The most recent `lastReviewed` date across all claims — the workbench's
 *  effective "as-of" stamp. Computed once at module load. */
export const lastReviewedAt: string = dataset.claims.reduce(
  (acc, c) => (c.lastReviewed > acc ? c.lastReviewed : acc),
  '0000-00-00',
)

// ── Reverse index: claim → atlas references ─────────────────────────────────
//
// The evidence workbench is a table-graph hybrid: a row is a claim, but a
// claim is only meaningful as something the mechanism graph *leans on*. These
// indices walk the link backwards — from a claim to the nodes and edges it
// underwrites — so the workbench can show that linkage laterally rather than
// burying the graph behind a drill-down.

export type MechanismRefs = { nodes: AtlasNode[]; edges: AtlasEdge[] }

const claimToNodes = new Map<string, AtlasNode[]>()
const claimToEdges = new Map<string, AtlasEdge[]>()

for (const node of dataset.atlas.nodes) {
  for (const cid of node.claimIds) {
    const arr = claimToNodes.get(cid)
    if (arr) arr.push(node)
    else claimToNodes.set(cid, [node])
  }
}
for (const edge of dataset.atlas.edges) {
  for (const cid of edge.claimIds) {
    const arr = claimToEdges.get(cid)
    if (arr) arr.push(edge)
    else claimToEdges.set(cid, [edge])
  }
}

/** The atlas nodes and edges whose drawing this claim authorises. */
export function mechanismRefsForClaim(claimId: string): MechanismRefs {
  return {
    nodes: claimToNodes.get(claimId) ?? [],
    edges: claimToEdges.get(claimId) ?? [],
  }
}

/**
 * Claims that share at least one atlas node or edge with the given claim —
 * its graph neighbourhood. Selecting a workbench row lights these up in the
 * table, surfacing the claim → mechanism → claim adjacency without leaving it.
 */
export function neighbourClaimIds(claimId: string): Set<string> {
  const { nodes, edges } = mechanismRefsForClaim(claimId)
  const ids = new Set<string>()
  for (const n of nodes) for (const cid of n.claimIds) ids.add(cid)
  for (const e of edges) for (const cid of e.claimIds) ids.add(cid)
  ids.delete(claimId)
  return ids
}

/** Claims this claim explicitly contradicts (the forward tension direction). */
export function contradictedClaims(claim: Claim): Claim[] {
  return claim.contradicts.flatMap((id) => {
    const c = claimsById.get(id)
    return c ? [c] : []
  })
}
