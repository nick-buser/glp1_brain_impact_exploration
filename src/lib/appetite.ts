// Loads and validates the appetite / meal-termination module, resolves the
// claims behind each regime, and exposes the satiation-curve maths shared by
// the page and the curve component. Validation runs at module load — a stage,
// regime, or gap pointing at a claim that does not exist fails here, not in
// the browser.

import { AppetiteModule, validateAppetite } from './schemas'
import { claimsById, resolveClaim, type ResolvedClaim } from './data'
import appetiteJson from '../data/appetite.json'

const parsed = AppetiteModule.safeParse(appetiteJson)
if (!parsed.success) {
  console.error('Appetite module schema validation failed:')
  console.error(parsed.error.issues)
  throw new Error('Appetite module failed schema validation — see console.')
}

export const appetiteModule = parsed.data

const refErrors = validateAppetite(appetiteModule, new Set(claimsById.keys()))
if (refErrors.length > 0) {
  console.error('Appetite module integrity errors:')
  for (const e of refErrors) console.error('  · ' + e)
  throw new Error(`Appetite module has ${refErrors.length} integrity error(s).`)
}

/** The claims behind a regime, resolved to evidence and papers. */
export function claimsForRegime(regimeId: string): ResolvedClaim[] {
  const regime = appetiteModule.regimes.find((r) => r.id === regimeId)
  if (!regime) return []
  return regime.claimIds.flatMap((cid) => {
    const r = resolveClaim(cid)
    return r ? [r] : []
  })
}

// ── The meal-termination curve ──────────────────────────────────────────────
//
// Satiation accumulates over a meal as a saturating exponential. `gain` is the
// per-regime accumulation rate; CURVE_K sets the shared curvature. This is a
// qualitative model — the claims are the evidence, the curve is the intuition.

export const CURVE_K = 3

/** Accumulated satiation signal at meal progress x ∈ [0,1]. */
export function satiationSignal(gain: number, x: number): number {
  return 1 - Math.exp(-CURVE_K * gain * x)
}

/** Meal-progress x at which the accumulating signal first reaches `level`. */
export function crossing(gain: number, level: number): number {
  if (gain <= 0) return Infinity
  return -Math.log(1 - level) / (CURVE_K * gain)
}

/** Meal size at a given gain, as a fraction of an unrestrained (baseline) meal. */
export function mealFraction(gain: number): number {
  const { satiety } = appetiteModule.thresholds
  return crossing(gain, satiety) / crossing(appetiteModule.baseline.gain, satiety)
}
