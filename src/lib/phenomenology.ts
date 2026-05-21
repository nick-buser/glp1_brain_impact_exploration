// Loads and validates the phenomenology module, and resolves a subjective
// report into its component decomposition. Validation runs at module load — a
// candidate naming a component that does not exist, or a claim id that does
// not resolve, fails here.
//
// The decomposition is deliberately a *structure*, not an answer. The weights
// are a curated qualitative reading; the claim graph is the real evidence, and
// every candidate's `claims` is how the mapper stays tethered to it.

import {
  PhenomenologyModule,
  validatePhenomenology,
  type Likelihood,
  type PhenomComponent,
} from './schemas'
import { claimsById, resolveClaim, type ResolvedClaim } from './data'
import phenomenologyJson from '../data/phenomenology.json'

const parsed = PhenomenologyModule.safeParse(phenomenologyJson)
if (!parsed.success) {
  console.error('Phenomenology module schema validation failed:')
  console.error(parsed.error.issues)
  throw new Error('Phenomenology module failed schema validation — see console.')
}

export const phenomenologyModule = parsed.data

const refErrors = validatePhenomenology(phenomenologyModule, new Set(claimsById.keys()))
if (refErrors.length > 0) {
  console.error('Phenomenology module integrity errors:')
  for (const e of refErrors) console.error('  · ' + e)
  throw new Error(`Phenomenology module has ${refErrors.length} integrity error(s).`)
}

export const componentsById = new Map(
  phenomenologyModule.components.map((c) => [c.id, c]),
)

/** The opening report — the first in the curated set. */
export const defaultReportId = phenomenologyModule.reports[0].id

// ── Resolved decomposition ──────────────────────────────────────────────────
//
// A report's candidates joined to their components and to resolved claims, and
// sorted strongest-fit first. `likelihood` is the honest label; `weight` only
// orders the bars — an "uncertain" candidate can outweigh a "low" one because
// uncertainty is not the same as a small effect.

export type ResolvedCandidate = {
  component: PhenomComponent
  likelihood: Likelihood
  weight: number
  rationale: string
  claims: ResolvedClaim[]
}

export type ResolvedReport = {
  id: string
  text: string
  naiveReading: string
  candidates: ResolvedCandidate[]
  discriminator: string
  caveats: string[]
}

/** Resolve a report id to its component decomposition, strongest fit first. */
export function resolveReport(reportId: string): ResolvedReport | undefined {
  const report = phenomenologyModule.reports.find((r) => r.id === reportId)
  if (!report) return undefined

  const candidates: ResolvedCandidate[] = report.candidates
    .flatMap((cand) => {
      const component = componentsById.get(cand.componentId)
      if (!component) return []
      const claims = cand.claimIds.flatMap((cid) => {
        const r = resolveClaim(cid)
        return r ? [r] : []
      })
      return [
        {
          component,
          likelihood: cand.likelihood,
          weight: cand.weight,
          rationale: cand.rationale,
          claims,
        },
      ]
    })
    .sort((a, b) => b.weight - a.weight)

  return {
    id: report.id,
    text: report.text,
    naiveReading: report.naiveReading,
    candidates,
    discriminator: report.discriminator,
    caveats: report.caveats,
  }
}

// ── Likelihood presentation ─────────────────────────────────────────────────
//
// `uncertain` is not a midpoint on the high→low scale — it is a separate claim:
// the magnitude is genuinely unknown. The UI marks it apart from low.

export type LikelihoodMeta = {
  label: string
  /** true for `uncertain` — the bar is drawn hatched, not solid. */
  unknown: boolean
}

export const LIKELIHOOD: Record<Likelihood, LikelihoodMeta> = {
  high: { label: 'High', unknown: false },
  moderate: { label: 'Moderate', unknown: false },
  low: { label: 'Low', unknown: false },
  uncertain: { label: 'Uncertain', unknown: true },
}
