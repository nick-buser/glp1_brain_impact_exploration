// The Berridge decomposition — wanting / liking / learning / effort, each with
// its own direction of effect and its own confidence. Per the UI/UX guide this
// must be visually present, not hidden behind a click: it is the corrective to
// the "dopamine goes down" collapse.

import type { BerridgeRow } from '../lib/schemas'
import { wantingModule } from '../lib/wanting'
import { Confidence } from './atlas'

const DIRECTION: Record<BerridgeRow['direction'], { glyph: string; color: string }> = {
  down: { glyph: '↓', color: 'var(--ink-1)' },
  flat: { glyph: '≈', color: 'var(--ink-2)' },
  unknown: { glyph: '?', color: 'var(--accent)' },
}

const COLS = '104px 1fr 1.05fr'

export function BerridgeBars() {
  return (
    <div style={{ marginTop: 12 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: COLS,
          gap: 16,
          padding: '6px 0 8px 0',
          borderBottom: '0.5px solid var(--rule-strong)',
        }}
      >
        <div className="micro">Component</div>
        <div className="micro">Direction · chronic peripheral therapeutic</div>
        <div className="micro">Evidence</div>
      </div>

      {wantingModule.berridge.map((r) => {
        const dir = DIRECTION[r.direction]
        return (
          <div
            key={r.key}
            style={{
              display: 'grid',
              gridTemplateColumns: COLS,
              gap: 16,
              alignItems: 'start',
              padding: '12px 0',
              borderBottom: '0.5px solid var(--rule-soft)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16 }}>
                  {r.label}
                </span>
                <span
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 17, color: dir.color }}
                >
                  {dir.glyph}
                </span>
              </div>
              <div style={{ marginTop: 4 }}>
                <Confidence level={r.confidence} />
              </div>
            </div>
            <DirectionalBar effect={r.effect} confidence={r.confidence} />
            <p
              className="margin-note"
              style={{ fontSize: 11.5, lineHeight: 1.5, margin: 0, fontStyle: 'normal' }}
            >
              {r.note}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function DirectionalBar({
  effect,
  confidence,
}: {
  effect: number
  confidence: BerridgeRow['confidence']
}) {
  const w = 268
  const h = 22
  const mid = w / 2
  const reach = w / 2 - 8
  const filled = effect * reach
  const isOpen = confidence === 'open'

  return (
    <svg width={w} height={h + 18} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={4} y1={h / 2} x2={w - 4} y2={h / 2} stroke="var(--rule)" strokeWidth="0.5" />
      <line
        x1={mid}
        y1={2}
        x2={mid}
        y2={h - 2}
        stroke="var(--rule-strong)"
        strokeWidth="0.5"
      />
      {!isOpen && filled > 0 && (
        <rect
          x={mid - filled}
          y={h / 2 - 5}
          width={filled}
          height={10}
          fill={confidence === 'speculative' ? 'var(--ink-3)' : 'var(--ink-1)'}
        />
      )}
      {isOpen && (
        <rect
          x={mid - reach}
          y={h / 2 - 5}
          width={reach * 2}
          height={10}
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
      )}
      <text
        x={4}
        y={h + 14}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8.5,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        ← reduced
      </text>
      <text
        x={mid}
        y={h + 14}
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8.5,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        baseline
      </text>
      <text
        x={w - 4}
        y={h + 14}
        textAnchor="end"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8.5,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        increased →
      </text>
    </svg>
  )
}
