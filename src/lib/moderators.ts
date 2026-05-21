// Loads and validates the moderators module, and runs the qualitative
// sensitivity simulation: a moderator selection projects onto effect-channel
// values and a translation-confidence score, and is scored for fit against the
// claim graph. Validation runs at module load — a preset that misses a
// dimension, or a channel pointing at a claim that does not exist, fails here.
//
// The simulation is deliberately qualitative. The deltas are a curated reading
// of the literature, not a fitted model; the claim graph is the real evidence,
// and `matchedClaims` is how the simulator stays tethered to it.

import { ModeratorsModule, validateModerators } from './schemas'
import { claimsById, resolveClaim, type ResolvedClaim } from './data'
import moderatorsJson from '../data/moderators.json'

const parsed = ModeratorsModule.safeParse(moderatorsJson)
if (!parsed.success) {
  console.error('Moderators module schema validation failed:')
  console.error(parsed.error.issues)
  throw new Error('Moderators module failed schema validation — see console.')
}

export const moderatorsModule = parsed.data

const refErrors = validateModerators(moderatorsModule, new Set(claimsById.keys()))
if (refErrors.length > 0) {
  console.error('Moderators module integrity errors:')
  for (const e of refErrors) console.error('  · ' + e)
  throw new Error(`Moderators module has ${refErrors.length} integrity error(s).`)
}

/** A moderator selection — dimension id → chosen option id. */
export type Selection = Record<string, string>

/** The opening selection: the first preset (the clinical register). */
export function defaultSelection(): Selection {
  return { ...moderatorsModule.presets[0].set }
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function optionOf(dimId: string, sel: Selection) {
  const dim = moderatorsModule.dimensions.find((d) => d.id === dimId)
  if (!dim) return undefined
  return dim.options.find((o) => o.id === sel[dimId]) ?? dim.options[0]
}

// ── The regime classification ───────────────────────────────────────────────

export type RegimeTone = 'clinical' | 'mixed' | 'experimental' | 'fragile'

export type Regime = {
  label: string
  note: string
  tone: RegimeTone
}

function classifyRegime(translation: number): Regime {
  if (translation >= 0.82)
    return {
      label: 'Clinical register',
      tone: 'clinical',
      note: 'Chronic peripheral therapy in humans — the regime in which clinical claims can honestly be made.',
    }
  if (translation >= 0.55)
    return {
      label: 'Mixed register',
      tone: 'mixed',
      note: 'Part clinical, part experimental — read each channel against its matched evidence, not the bar alone.',
    }
  if (translation >= 0.3)
    return {
      label: 'Experimental register',
      tone: 'experimental',
      note: 'Experimental dosing or non-human models — informative about mechanism, weak ground for clinical inference.',
    }
  return {
    label: 'Translation-fragile',
    tone: 'fragile',
    note: 'Acute central dosing in rodent models — establishes that an effect can occur, not that patients experience it.',
  }
}

// ── The simulation ──────────────────────────────────────────────────────────

export type ChannelResult = {
  channelId: string
  value: number // clamped −1..1
}

export type Simulation = {
  channels: ChannelResult[]
  translation: number // 0..1
  regime: Regime
}

/** Project a moderator selection onto channel values and a regime. */
export function simulate(sel: Selection): Simulation {
  const channels: ChannelResult[] = moderatorsModule.channels.map((ch) => {
    let v = ch.baseline
    for (const dim of moderatorsModule.dimensions) {
      const opt = optionOf(dim.id, sel)
      if (opt) v += opt.deltas[ch.id] ?? 0
    }
    return { channelId: ch.id, value: clamp(v, -1, 1) }
  })

  let fragility = 0
  for (const dim of moderatorsModule.dimensions) {
    const opt = optionOf(dim.id, sel)
    if (opt) fragility += opt.fragility
  }
  const translation = clamp(1 - fragility, 0, 1)

  return { channels, translation, regime: classifyRegime(translation) }
}

// ── Magnitude buckets ───────────────────────────────────────────────────────

export type Magnitude = 'negligible' | 'mild' | 'moderate' | 'strong'

export function magnitudeOf(value: number): Magnitude {
  const m = Math.abs(value)
  if (m < 0.12) return 'negligible'
  if (m < 0.4) return 'mild'
  if (m < 0.7) return 'moderate'
  return 'strong'
}

// ── Claim-graph match ───────────────────────────────────────────────────────
//
// The simulator is tethered to the graph by scoring each channel's claims for
// fit against the current selection. Only the four *grounded* dimensions —
// route, chronicity, species, molecule — are encoded in a claim's scope; that
// is exactly why dose, sex and baseline state are marked ungrounded in the UI.

export type ClaimMatch = {
  resolved: ResolvedClaim
  channelId: string
  score: number // 0..4 grounded dimensions matched
  matched: string[] // labels of the dimensions that matched
}

const GROUNDED_DIMS = ['route', 'chronicity', 'species', 'molecule'] as const

export function matchedClaims(sel: Selection): ClaimMatch[] {
  const seen = new Set<string>()
  const out: ClaimMatch[] = []

  for (const ch of moderatorsModule.channels) {
    for (const cid of ch.claimIds) {
      if (seen.has(cid)) continue
      seen.add(cid)
      const resolved = resolveClaim(cid)
      if (!resolved) continue

      const scope = resolved.claim.scope
      const matched: string[] = []

      for (const dimId of GROUNDED_DIMS) {
        const opt = optionOf(dimId, sel)
        if (!opt) continue
        if (dimId === 'molecule') {
          const drug = (scope.drug ?? '').toLowerCase()
          if (opt.match?.some((m) => drug.includes(m.toLowerCase()))) matched.push('molecule')
        } else if (scope[dimId as 'route' | 'chronicity' | 'species'] === opt.id) {
          matched.push(dimId)
        }
      }

      out.push({ resolved, channelId: ch.id, score: matched.length, matched })
    }
  }

  return out.sort((a, b) => b.score - a.score)
}
