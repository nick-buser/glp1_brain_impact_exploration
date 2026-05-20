// Loads and validates the wanting / hedonic-tone module, and resolves the
// claims behind the Berridge `wanting` row and the Kooji tension pair.

import { WantingModule, validateWanting } from './schemas'
import { claimsById, resolveClaim, type ResolvedClaim } from './data'
import wantingJson from '../data/wanting.json'

const parsed = WantingModule.safeParse(wantingJson)
if (!parsed.success) {
  console.error('Wanting module schema validation failed:')
  console.error(parsed.error.issues)
  throw new Error('Wanting module failed schema validation — see console.')
}

export const wantingModule = parsed.data

const refErrors = validateWanting(wantingModule, new Set(claimsById.keys()))
if (refErrors.length > 0) {
  console.error('Wanting module integrity errors:')
  for (const e of refErrors) console.error('  · ' + e)
  throw new Error(`Wanting module has ${refErrors.length} integrity error(s).`)
}

function mustResolve(claimId: string): ResolvedClaim {
  const r = resolveClaim(claimId)
  if (!r) throw new Error(`Wanting module: claim "${claimId}" did not resolve.`)
  return r
}

/** The two claims of the Kooji contradiction, resolved. */
export const tension = {
  left: mustResolve(wantingModule.tension.leftClaimId),
  right: mustResolve(wantingModule.tension.rightClaimId),
  label: wantingModule.tension.label,
  note: wantingModule.tension.note,
}

/** Resolve a Berridge row's backing claim, if it has one. */
export function rowClaim(claimId: string | undefined): ResolvedClaim | undefined {
  return claimId ? resolveClaim(claimId) : undefined
}
