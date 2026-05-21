// The standard-explainer cascade — gut → vagal relay → brainstem →
// hypothalamus → a smaller meal. Deliberately a flat, conventional flow
// diagram: this is the version most accounts of GLP-1 weight loss stop at, and
// the module renders it plainly before showing, alongside, what it omits.
// Layout is computed from each stage's tier, so the data file carries no
// pixel coordinates.

import { appetiteModule } from '../lib/appetite'
import type { AppetiteTier } from '../lib/schemas'

const TIERS: { id: AppetiteTier; label: string }[] = [
  { id: 'gut', label: 'Gut' },
  { id: 'relay', label: 'Vagal relay' },
  { id: 'brainstem', label: 'Brainstem' },
  { id: 'hypothalamus', label: 'Hypothalamus' },
  { id: 'outcome', label: 'Outcome' },
]

const W = 640
const H = 304
const NODE_W = 104
const NODE_H = 46
const COL_X = [56, 188, 320, 452, 584] // column centres, one per tier
const ROW_GAP = 66
const MID_Y = 158

type Pt = { x: number; y: number }

function layout(): Map<string, Pt> {
  const pos = new Map<string, Pt>()
  TIERS.forEach((tier, ti) => {
    const stages = appetiteModule.cascade.stages.filter((s) => s.tier === tier.id)
    stages.forEach((s, j) => {
      pos.set(s.id, {
        x: COL_X[ti],
        y: MID_Y + (j - (stages.length - 1) / 2) * ROW_GAP,
      })
    })
  })
  return pos
}

export function SatietyCascade() {
  const { stages, edges } = appetiteModule.cascade
  const pos = layout()

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label="The gut-brain-hypothalamus satiety cascade"
      style={{ display: 'block', marginTop: 10, maxHeight: 340 }}
    >
      <defs>
        <marker
          id="ap-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-3)" />
        </marker>
      </defs>

      {/* tier labels */}
      {TIERS.map((t, i) => (
        <text
          key={t.id}
          x={COL_X[i]}
          y={22}
          textAnchor="middle"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 8,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fill: 'var(--ink-3)',
          }}
        >
          {t.label}
        </text>
      ))}

      {/* edges — drawn from node edge to node edge */}
      {edges.map((e, i) => {
        const a = pos.get(e.from)
        const b = pos.get(e.to)
        if (!a || !b) return null
        const x1 = a.x + NODE_W / 2
        const x2 = b.x - NODE_W / 2
        return (
          <line
            key={i}
            x1={x1}
            y1={a.y}
            x2={x2}
            y2={b.y}
            stroke="var(--ink-3)"
            strokeWidth="1"
            markerEnd="url(#ap-arrow)"
          >
            {e.note && <title>{e.note}</title>}
          </line>
        )
      })}

      {/* stage nodes */}
      {stages.map((s) => {
        const p = pos.get(s.id)
        if (!p) return null
        const outcome = s.tier === 'outcome'
        return (
          <g key={s.id} transform={`translate(${p.x},${p.y})`}>
            <title>{s.note}</title>
            <rect
              x={-NODE_W / 2}
              y={-NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              rx={4}
              fill={outcome ? 'var(--accent-bg)' : 'var(--bg-paper)'}
              stroke={outcome ? 'var(--accent-rule)' : 'var(--rule-strong)'}
              strokeWidth="0.75"
            />
            <text
              x={0}
              y={-3}
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 11,
                fill: outcome ? 'var(--accent)' : 'var(--ink-1)',
              }}
            >
              {s.label}
            </text>
            <text
              x={0}
              y={11}
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 7,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fill: 'var(--ink-3)',
              }}
            >
              {s.sub}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
