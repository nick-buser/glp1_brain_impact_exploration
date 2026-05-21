// Loads and validates the aversive-affect / stress-axis module, and resolves
// the claims behind each regime. Validation runs at module load — a region or
// regime pointing at a claim that does not exist fails here, not in the
// browser.

import { AversiveModule, validateAversive } from './schemas'
import { claimsById, resolveClaim, type ResolvedClaim } from './data'
import aversiveJson from '../data/aversive.json'

const parsed = AversiveModule.safeParse(aversiveJson)
if (!parsed.success) {
  console.error('Aversive module schema validation failed:')
  console.error(parsed.error.issues)
  throw new Error('Aversive module failed schema validation — see console.')
}

export const aversiveModule = parsed.data

const refErrors = validateAversive(aversiveModule, new Set(claimsById.keys()))
if (refErrors.length > 0) {
  console.error('Aversive module integrity errors:')
  for (const e of refErrors) console.error('  · ' + e)
  throw new Error(`Aversive module has ${refErrors.length} integrity error(s).`)
}

/** The claims behind a regime, resolved to evidence and papers. */
export function claimsForRegime(regimeId: string): ResolvedClaim[] {
  const regime = aversiveModule.regimes.find((r) => r.id === regimeId)
  if (!regime) return []
  return regime.claimIds.flatMap((cid) => {
    const r = resolveClaim(cid)
    return r ? [r] : []
  })
}
