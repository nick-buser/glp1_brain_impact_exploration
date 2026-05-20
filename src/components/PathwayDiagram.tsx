// PPG-NTS projections, lit by the current state. Node fill encodes recruitment
// strength; it morphs continuously as the dial is dragged. The pharmacologic
// state routes a separate peripheral input that partially bypasses PPG.

import { ppgModule, sampleByState } from '../lib/ppg'

const NTS = { x: 190, y: 320, r: 34 }

export function PathwayDiagram({ pos }: { pos: number }) {
  const { states, targets } = ppgModule
  const last = states.length - 1
  const activities = states.map((s) => s.activity)
  const ntsActivity = sampleByState(activities, pos)

  // Discrete pharmacologic colouring; continuous fade for the bypass arrow.
  const pharm = Math.round(pos) === last
  const pharmBlend = Math.max(0, Math.min(1, pos - (last - 1)))
  const lit = pharm ? 'var(--accent)' : 'var(--ink-1)'

  return (
    <svg
      width="100%"
      viewBox="0 0 460 380"
      style={{ marginTop: 10, maxHeight: 420, display: 'block' }}
      role="img"
      aria-label="PPG-NTS projection recruitment for the selected state"
    >
      <defs>
        <marker
          id="ppg-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>

      <rect
        x="2"
        y="2"
        width="456"
        height="376"
        fill="none"
        stroke="var(--rule-soft)"
        strokeWidth="0.5"
      />

      {/* Projections + target nodes */}
      {targets.map((t) => {
        const a = sampleByState(t.byState, pos)
        return (
          <g key={t.id}>
            <line
              x1={NTS.x}
              y1={NTS.y - NTS.r}
              x2={t.x + 22}
              y2={t.y + 22}
              stroke={pharm ? 'var(--accent)' : 'var(--ink-2)'}
              strokeWidth={0.5 + a * 1.5}
              opacity={0.22 + a * 0.65}
              strokeDasharray={pharm ? '2 3' : undefined}
            />
            <g transform={`translate(${t.x},${t.y})`}>
              <circle
                cx={22}
                cy={22}
                r={22}
                fill="var(--bg-paper)"
                stroke={a > 0.4 ? 'var(--ink-1)' : 'var(--rule-strong)'}
                strokeWidth={a > 0.4 ? 1 : 0.5}
              />
              <circle cx={22} cy={22} r={a * 18} fill={lit} opacity={0.15 + a * 0.5} />
              <text
                x={22}
                y={20}
                textAnchor="middle"
                style={{ fontFamily: 'var(--font-serif)', fontSize: 11, fill: 'var(--ink-1)' }}
              >
                {t.label}
              </text>
              <text
                x={22}
                y={32}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 7.5,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fill: 'var(--ink-3)',
                }}
              >
                {t.sub}
              </text>
            </g>
          </g>
        )
      })}

      {/* Peripheral GLP-1RA bypass — fades in toward the pharmacologic state */}
      <g opacity={pharmBlend}>
        <text
          x="20"
          y="364"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fill: 'var(--accent)',
          }}
        >
          peripheral GLP-1RA
        </text>
        <path
          d="M 92 357 Q 132 340 158 330"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          markerEnd="url(#ppg-arrow)"
        />
        <text
          x="95"
          y="348"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fill: 'var(--accent)' }}
        >
          via AP / NTS
        </text>
      </g>

      {/* NTS */}
      <g transform={`translate(${NTS.x},${NTS.y})`}>
        <circle r={NTS.r} fill="var(--bg-paper)" stroke="var(--ink-1)" strokeWidth="1" />
        <circle r={6 + ntsActivity * 22} fill={lit} opacity={0.15 + ntsActivity * 0.5} />
        <text
          textAnchor="middle"
          dy={-2}
          style={{ fontFamily: 'var(--font-serif)', fontSize: 13, fill: 'var(--ink-1)' }}
        >
          PPG-NTS
        </text>
        <text
          textAnchor="middle"
          dy={12}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 8.5,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fill: 'var(--ink-3)',
          }}
        >
          caudal medulla
        </text>
      </g>

      {/* Legend */}
      <g transform="translate(316, 16)">
        <text
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fill: 'var(--ink-3)',
          }}
        >
          Recruitment
        </text>
        <circle cx={8} cy={20} r={3} fill="var(--ink-1)" opacity="0.18" />
        <circle cx={36} cy={20} r={8} fill="var(--ink-1)" opacity="0.4" />
        <circle cx={70} cy={20} r={12} fill="var(--ink-1)" opacity="0.6" />
        <text y={42} style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fill: 'var(--ink-3)' }}>
          quiet
        </text>
        <text
          x={56}
          y={42}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fill: 'var(--ink-3)' }}
        >
          recruited
        </text>
      </g>
    </svg>
  )
}
