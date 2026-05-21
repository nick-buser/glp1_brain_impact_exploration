// Loads and validates the neuroimmune / insulin / cognition module — the
// hype-control surface built around the cell → rodent → observational → RCT
// translation ladder. Validation runs at module load: a track that skips a
// rung, or a step pointing at a claim that does not exist, fails here, not in
// the browser.

import { NeuroimmuneModule, validateNeuroimmune, type LadderGrade } from './schemas'
import { claimsById, resolveClaim, type ResolvedClaim } from './data'
import neuroimmuneJson from '../data/neuroimmune.json'

const parsed = NeuroimmuneModule.safeParse(neuroimmuneJson)
if (!parsed.success) {
  console.error('Neuroimmune module schema validation failed:')
  console.error(parsed.error.issues)
  throw new Error('Neuroimmune module failed schema validation — see console.')
}

export const neuroimmuneModule = parsed.data

const refErrors = validateNeuroimmune(neuroimmuneModule, new Set(claimsById.keys()))
if (refErrors.length > 0) {
  console.error('Neuroimmune module integrity errors:')
  for (const e of refErrors) console.error('  · ' + e)
  throw new Error(`Neuroimmune module has ${refErrors.length} integrity error(s).`)
}

/** The fixed ladder rungs, indexed by id. */
export const rungById = new Map(neuroimmuneModule.rungs.map((r) => [r.id, r]))

/** Resolve a list of claim ids to evidence and papers, dropping any miss. */
export function resolveClaims(claimIds: string[]): ResolvedClaim[] {
  return claimIds.flatMap((cid) => {
    const r = resolveClaim(cid)
    return r ? [r] : []
  })
}

// ── Grade vocabulary ────────────────────────────────────────────────────────
//
// The shared reading of each ladder grade. `rank` orders them from the
// strongest support to outright refutation; the ladder and the rung detail
// both key their treatment off this single table so the two registers cannot
// drift apart.

export type GradeMeta = {
  label: string
  glyph: string
  /** what the grade asserts, in one phrase */
  gloss: string
  /** higher = more supportive; refuted is its own register, ranked lowest */
  rank: number
}

export const GRADE_META: Record<LadderGrade, GradeMeta> = {
  supportive: {
    label: 'Supportive',
    glyph: '●',
    gloss: 'evidence at this rung supports the hypothesis',
    rank: 4,
  },
  mixed: {
    label: 'Mixed',
    glyph: '◐',
    gloss: 'evidence at this rung is genuinely split',
    rank: 3,
  },
  preliminary: {
    label: 'Preliminary',
    glyph: '◔',
    gloss: 'early or thin evidence, leaning supportive',
    rank: 2,
  },
  untested: {
    label: 'Untested',
    glyph: '○',
    gloss: 'no study occupies this rung — not the same as a failed test',
    rank: 1,
  },
  refuted: {
    label: 'Refuted',
    glyph: '✕',
    gloss: 'evidence at this rung contradicts the hypothesis',
    rank: 0,
  },
}
