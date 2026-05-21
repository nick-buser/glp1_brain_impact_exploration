// The row model behind the evidence workbench. A workbench row is a claim
// flattened against everything that backs it — its evidence, the species it
// rests on, the atlas it underwrites, how stale it has gone. The flattening
// happens once here so the table cells stay cheap and the sort/filter logic
// has plain scalars to work with.

import {
  daysSinceReviewed,
  mechanismRefsForClaim,
  resolveClaim,
  STALE_THRESHOLD_DAYS,
  dataset,
  type ResolvedClaim,
} from './data'
import type { Confidence, Polarity, Scope, Species } from './schemas'

export type ClaimRow = {
  id: string
  statement: string
  confidence: Confidence
  polarity: Polarity
  scope: Scope
  evidenceCount: number
  /** Distinct species across the claim's evidence — the translation spread. */
  speciesMix: Species[]
  /** How many atlas nodes + edges this claim authorises. */
  atlasRefCount: number
  lastReviewed: string
  staleDays: number
  /** Contradicts something, is contradicted, or is itself contradicted. */
  inTension: boolean
  resolved: ResolvedClaim
}

// Confidence is ordinal, not nominal — sorting by it should run strongest to
// weakest, not alphabetically. This rank is also the facet display order.
export const CONFIDENCE_ORDER: Confidence[] = [
  'strong',
  'moderate',
  'speculative',
  'contradicted',
  'open',
]
export const CONFIDENCE_RANK: Record<Confidence, number> = {
  strong: 0,
  moderate: 1,
  speculative: 2,
  contradicted: 3,
  open: 4,
}

export const POLARITY_ORDER: Polarity[] = [
  'supports',
  'modulates',
  'weakens',
  'contradicts',
]

export const SPECIES_ORDER: Species[] = ['human', 'nhp', 'rat', 'mouse', 'cell']

export const STALE_DAYS = STALE_THRESHOLD_DAYS

/** Flatten every claim in the dataset into a workbench row. */
export function buildClaimRows(): ClaimRow[] {
  return dataset.claims.flatMap((claim) => {
    const resolved = resolveClaim(claim.id)
    if (!resolved) return []
    const refs = mechanismRefsForClaim(claim.id)
    const speciesMix = [...new Set(resolved.evidence.map((e) => e.species))].sort(
      (a, b) => SPECIES_ORDER.indexOf(a) - SPECIES_ORDER.indexOf(b),
    )
    return [
      {
        id: claim.id,
        statement: claim.statement,
        confidence: claim.confidence,
        polarity: claim.polarity,
        scope: claim.scope,
        evidenceCount: resolved.evidence.length,
        speciesMix,
        atlasRefCount: refs.nodes.length + refs.edges.length,
        lastReviewed: claim.lastReviewed,
        staleDays: daysSinceReviewed(claim),
        inTension:
          claim.confidence === 'contradicted' ||
          claim.contradicts.length > 0 ||
          resolved.contradictedBy.length > 0,
        resolved,
      },
    ]
  })
}

export type FacetKey = 'confidence' | 'polarity' | 'species'

/** Count rows per facet value, over the full row set (selection-independent). */
export function facetCounts(rows: ClaimRow[]) {
  const tally = <T extends string>(values: T[]): Record<string, number> => {
    const out: Record<string, number> = {}
    for (const v of values) out[v] = (out[v] ?? 0) + 1
    return out
  }
  return {
    confidence: tally(rows.map((r) => r.confidence)),
    polarity: tally(rows.map((r) => r.polarity)),
    species: tally(rows.flatMap((r) => r.speciesMix)),
  }
}
