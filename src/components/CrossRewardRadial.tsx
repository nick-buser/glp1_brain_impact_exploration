// The evidence-graded radial map. The shared mechanism sits at the hub; each
// reward domain sits on the confidence ring its best available evidence earns
// — food and alcohol close in, gambling far out. Ring radius, spoke weight,
// and the node's confidence bars all encode the same grade, deliberately
// redundantly: the slice exists to make overgeneralisation impossible to miss.

import type { Confidence as ConfidenceLevel } from '../lib/schemas'
import { crossRewardModule } from '../lib/cross-reward'

const CX = 280
const CY = 250
const HUB_R = 44

// Confidence → ring radius. The outer a domain sits, the thinner its case.
const RING: Record<ConfidenceLevel, number> = {
  strong: 72,
  moderate: 120,
  speculative: 168,
  contradicted: 168,
  open: 212,
}
const COLOR: Record<ConfidenceLevel, string> = {
  strong: 'var(--ink-1)',
  moderate: 'var(--ink-2)',
  speculative: 'var(--ink-3)',
  contradicted: 'var(--accent)',
  open: 'var(--ink-3)',
}
const BARS: Record<ConfidenceLevel, number> = {
  strong: 3,
  moderate: 2,
  speculative: 1,
  contradicted: 0,
  open: 0,
}
const SPOKE_W: Record<ConfidenceLevel, number> = {
  strong: 1.7,
  moderate: 1.2,
  speculative: 0.85,
  contradicted: 1,
  open: 0.6,
}

const RINGS: ConfidenceLevel[] = ['strong', 'moderate', 'speculative', 'open']

/** Polar placement — angle 0 points straight up, increasing clockwise. */
function polar(angleDeg: number, r: number) {
  const t = (angleDeg * Math.PI) / 180
  return { x: CX + r * Math.sin(t), y: CY - r * Math.cos(t) }
}

export function CrossRewardRadial({
  selectedId,
  onSelect,
}: {
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <svg
      viewBox="0 0 470 480"
      width="100%"
      role="img"
      aria-label="Evidence-graded radial map of GLP-1RA cross-reward effects"
      style={{ display: 'block', maxHeight: 470, marginTop: 8 }}
    >
      {/* confidence rings — outer rings are less certain */}
      {RINGS.map((c) => (
        <circle
          key={c}
          cx={CX}
          cy={CY}
          r={RING[c]}
          fill="none"
          stroke="var(--rule)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
        />
      ))}

      {/* spokes — hub to each domain, weighted by confidence */}
      {crossRewardModule.domains.map((d) => {
        const node = polar(d.angle, RING[d.confidence])
        const inner = polar(d.angle, HUB_R)
        const sel = d.id === selectedId
        return (
          <line
            key={'spoke-' + d.id}
            x1={inner.x}
            y1={inner.y}
            x2={node.x}
            y2={node.y}
            stroke={sel ? 'var(--accent)' : COLOR[d.confidence]}
            strokeWidth={sel ? 1.9 : SPOKE_W[d.confidence]}
            strokeDasharray={d.confidence === 'open' ? '3 3' : undefined}
          />
        )
      })}

      {/* hub — the shared mechanism */}
      <circle
        cx={CX}
        cy={CY}
        r={HUB_R}
        fill="var(--bg-sunk)"
        stroke="var(--rule-strong)"
        strokeWidth="0.75"
      />
      <text
        x={CX}
        y={CY - 6}
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 7.5,
          letterSpacing: '0.07em',
          fill: 'var(--ink-3)',
        }}
      >
        GLP-1RA
      </text>
      <text
        x={CX}
        y={CY + 8}
        textAnchor="middle"
        style={{ fontFamily: 'var(--font-serif)', fontSize: 12.5, fill: 'var(--ink-1)' }}
      >
        incentive
      </text>
      <text
        x={CX}
        y={CY + 22}
        textAnchor="middle"
        style={{ fontFamily: 'var(--font-serif)', fontSize: 12.5, fill: 'var(--ink-1)' }}
      >
        salience ↓
      </text>

      {/* domain nodes */}
      {crossRewardModule.domains.map((d) => {
        const node = polar(d.angle, RING[d.confidence])
        const sel = d.id === selectedId
        const w = 96
        const h = 38
        const color = COLOR[d.confidence]
        return (
          <g
            key={d.id}
            transform={`translate(${node.x},${node.y})`}
            className="node-hit"
            onClick={() => onSelect(d.id)}
            role="button"
            aria-label={`${d.label} — ${d.confidence} evidence`}
          >
            <rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              rx={4}
              fill="var(--bg-paper)"
              stroke={sel ? 'var(--accent)' : color}
              strokeWidth={sel ? 1.75 : 0.75}
            />
            {d.proximal && (
              <text
                x={0}
                y={-h / 2 - 5}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 7,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  fill: 'var(--ink-3)',
                }}
              >
                proximate target
              </text>
            )}
            <text
              x={0}
              y={-3}
              textAnchor="middle"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 13, fill: 'var(--ink-1)' }}
            >
              {d.label}
            </text>
            {d.confidence === 'open' ? (
              <text
                x={0}
                y={13}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9.5,
                  fill: 'var(--ink-3)',
                }}
              >
                ◇ open
              </text>
            ) : (
              <g transform="translate(0,9)">
                {[0, 1, 2].map((i) => (
                  <rect
                    key={i}
                    x={-12.5 + i * 9}
                    y={0}
                    width={7}
                    height={3.6}
                    rx={0.5}
                    fill={i < BARS[d.confidence] ? color : 'var(--ink-4)'}
                  />
                ))}
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
