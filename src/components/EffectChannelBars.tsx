// The effect-channel panel — the qualitative readout of the moderator
// simulator. Each channel is a bar on a shared axis whose centre is "no
// effect": rightward is the channel's named phenomenon present, leftward its
// absence. Colour carries valence — accent when a notable side-effect or
// dysphoric signal is present, ink when a therapeutic effect is, faint ink
// when the bar sits in the reassuring direction. The bars are a curated
// qualitative model — flipping a preset reconfigures every one at once, which
// is the dashboard's whole argument. Confidence is carried by the regime
// banner and the matched evidence, not faked into the bar.

import { moderatorsModule, magnitudeOf, type Simulation } from '../lib/moderators'
import type { ModeratorChannel } from '../lib/schemas'

const MAG_LABEL: Record<string, string> = {
  negligible: 'negligible',
  mild: 'mild',
  moderate: 'moderate',
  strong: 'strong',
}

/**
 * The fill colour for a channel's bar. A bar reads accent only when it shows a
 * notable side-effect or dysphoric signal; a therapeutic effect reads ink; a
 * bar pointing the reassuring way (no side-effect, or lost benefit) reads faint.
 */
function fillColor(kind: ModeratorChannel['kind'], value: number): string {
  if (kind === 'adverse') return value >= 0 ? 'var(--accent)' : 'var(--ink-3)'
  if (kind === 'signed') return value < 0 ? 'var(--accent)' : 'var(--cool)'
  return value >= 0 ? 'var(--ink-1)' : 'var(--ink-3)'
}

export function EffectChannelBars({ sim }: { sim: Simulation }) {
  return (
    <div style={{ marginTop: 12 }}>
      {moderatorsModule.channels.map((ch) => {
        const result = sim.channels.find((c) => c.channelId === ch.id)
        const value = result ? result.value : 0
        const mag = magnitudeOf(value)
        const negligible = mag === 'negligible'
        const color = fillColor(ch.kind, value)
        const pct = Math.abs(value) * 50

        return (
          <div
            key={ch.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '146px 1fr 134px',
              gap: 14,
              alignItems: 'center',
              padding: '11px 0',
              borderBottom: '0.5px solid var(--rule-soft)',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 13.5,
                  color: 'var(--ink-1)',
                  lineHeight: 1.25,
                }}
              >
                {ch.label}
              </div>
              <div className="micro" style={{ marginTop: 2, fontSize: 9 }}>
                {ch.sub}
              </div>
            </div>

            {/* the signed bar */}
            <div
              className="mod-bar"
              role="img"
              aria-label={`${ch.label}: ${negligible ? 'negligible' : mag} — ${
                value < 0 ? ch.negative : ch.positive
              }`}
            >
              <div className="mod-bar-track" />
              <div className="mod-bar-zero" />
              {!negligible && (
                <div
                  className="mod-bar-fill"
                  style={{
                    background: color,
                    left: value >= 0 ? '50%' : `${50 - pct}%`,
                    width: `${pct}%`,
                  }}
                />
              )}
              {negligible && <div className="mod-bar-null" />}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                className="micro"
                style={{
                  fontSize: 9.5,
                  color: negligible ? 'var(--ink-3)' : color,
                }}
              >
                {MAG_LABEL[mag]}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 11,
                  fontStyle: 'italic',
                  color: 'var(--ink-2)',
                  lineHeight: 1.35,
                  marginTop: 2,
                  textWrap: 'pretty',
                }}
              >
                {negligible
                  ? 'effectively no effect'
                  : value < 0
                    ? ch.negative
                    : ch.positive}
              </div>
            </div>
          </div>
        )
      })}

      <div style={{ display: 'grid', gridTemplateColumns: '146px 1fr 134px', gap: 14 }}>
        <span />
        <span
          className="micro"
          style={{ fontSize: 8.5, textAlign: 'center', marginTop: 5 }}
        >
          ← absent ·│· effect present →
        </span>
        <span />
      </div>
    </div>
  )
}
