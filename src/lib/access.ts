// Loads and validates the brain-access / relay module, and resolves the claims
// behind each route and drug. Validation runs at module load — a route or drug
// pointing at a claim that does not exist, a region naming an unknown route, or
// a peptide modification indexing past the sequence fails here, not in the
// browser.

import { AccessModule, validateAccess } from './schemas'
import { claimsById, resolveClaim, type ResolvedClaim } from './data'
import accessJson from '../data/access.json'

const parsed = AccessModule.safeParse(accessJson)
if (!parsed.success) {
  console.error('Access module schema validation failed:')
  console.error(parsed.error.issues)
  throw new Error('Access module failed schema validation — see console.')
}

export const accessModule = parsed.data

const refErrors = validateAccess(accessModule, new Set(claimsById.keys()))
if (refErrors.length > 0) {
  console.error('Access module integrity errors:')
  for (const e of refErrors) console.error('  · ' + e)
  throw new Error(`Access module has ${refErrors.length} integrity error(s).`)
}

/** The claims behind a route, resolved to evidence and papers. */
export function claimsForRoute(routeId: string): ResolvedClaim[] {
  const route = accessModule.routes.find((r) => r.id === routeId)
  if (!route) return []
  return route.claimIds.flatMap((cid) => {
    const r = resolveClaim(cid)
    return r ? [r] : []
  })
}

/** The claims behind a drug, resolved to evidence and papers. */
export function claimsForDrug(drugId: string): ResolvedClaim[] {
  const drug = accessModule.drugs.find((d) => d.id === drugId)
  if (!drug) return []
  return drug.claimIds.flatMap((cid) => {
    const r = resolveClaim(cid)
    return r ? [r] : []
  })
}
