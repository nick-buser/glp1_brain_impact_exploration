// Loads and validates the PPG-NTS module data, and resolves each state's
// claims against the core claim graph.

import { PpgNtsModule, validatePpgNts } from './schemas'
import { claimsById, resolveClaim, type ResolvedClaim } from './data'
import ppgJson from '../data/ppg-nts.json'

const parsed = PpgNtsModule.safeParse(ppgJson)
if (!parsed.success) {
  console.error('PPG-NTS module schema validation failed:')
  console.error(parsed.error.issues)
  throw new Error('PPG-NTS module failed schema validation — see console.')
}

export const ppgModule = parsed.data

const refErrors = validatePpgNts(ppgModule, new Set(claimsById.keys()))
if (refErrors.length > 0) {
  console.error('PPG-NTS module integrity errors:')
  for (const e of refErrors) console.error('  · ' + e)
  throw new Error(`PPG-NTS module has ${refErrors.length} integrity error(s).`)
}

/** Resolve the claims attached to a state, by index. */
export function claimsForState(stateIndex: number): ResolvedClaim[] {
  const state = ppgModule.states[stateIndex]
  if (!state) return []
  return state.claimIds.flatMap((cid) => {
    const r = resolveClaim(cid)
    return r ? [r] : []
  })
}

/** Linear interpolation between two numbers. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Interpolate a per-state value array at a fractional state position.
 * Lets the pathway diagram morph smoothly as the dial is dragged.
 */
export function sampleByState(values: number[], pos: number): number {
  const max = values.length - 1
  const clamped = Math.max(0, Math.min(max, pos))
  const lo = Math.floor(clamped)
  const hi = Math.ceil(clamped)
  return lerp(values[lo], values[hi], clamped - lo)
}
