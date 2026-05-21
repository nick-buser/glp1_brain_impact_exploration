// Loads and validates the cross-reward module, and resolves each domain's
// backing claims. Validation runs at module load — a domain pointing at a
// claim that does not exist fails here, not in the browser.

import { CrossRewardModule, validateCrossReward } from './schemas'
import { claimsById, resolveClaim, type ResolvedClaim } from './data'
import crossRewardJson from '../data/cross-reward.json'

const parsed = CrossRewardModule.safeParse(crossRewardJson)
if (!parsed.success) {
  console.error('Cross-reward module schema validation failed:')
  console.error(parsed.error.issues)
  throw new Error('Cross-reward module failed schema validation — see console.')
}

export const crossRewardModule = parsed.data

const refErrors = validateCrossReward(crossRewardModule, new Set(claimsById.keys()))
if (refErrors.length > 0) {
  console.error('Cross-reward module integrity errors:')
  for (const e of refErrors) console.error('  · ' + e)
  throw new Error(`Cross-reward module has ${refErrors.length} integrity error(s).`)
}

/** A domain's backing claims, resolved to evidence and papers. */
export function claimsForDomain(domainId: string): ResolvedClaim[] {
  const domain = crossRewardModule.domains.find((d) => d.id === domainId)
  if (!domain) return []
  return domain.claimIds.flatMap((cid) => {
    const r = resolveClaim(cid)
    return r ? [r] : []
  })
}
