// The PVN / CeA dissociation — the structural heart of the aversive branch.
// PPG-NTS projects to both, but they split: the PVN drives the HPA axis with
// little anxiety, the CeA drives anxiety with little HPA. Each region carries
// two drive-bars so the dissociation is a picture, not a sentence. The whole
// diagram dims when the selected regime is not the rodent · central · acute
// one — the regime this circuit-level evidence was actually mapped in.

import { aversiveModule } from '../lib/aversive'

const GEO: Record<string, { x: number; y: number }> = {
  pvn: { x: 232, y: 74 },
  cea: { x: 212, y: 224 },
  bnst: { x: 380, y: 224 },
}
const NODE_W = 128
const NODE_H = 76
const SRC = { x: 62, y: 158, r: 30 }

function DriveBar({
  cy,
  label,
  value,
  color,
}: {
  cy: number
  label: string
  value: number
  color: string
}) {
  const w = 78
  return (
    <g>
      <text
        x={-58}
        y={cy + 3}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 7,
          letterSpacing: '0.05em',
          fill: 'var(--ink-3)',
        }}
      >
        {label}
      </text>
      <rect
        x={-32}
        y={cy - 3.5}
        width={w}
        height={7}
        rx={1}
        fill="var(--bg-sunk)"
        stroke="var(--rule-soft)"
        strokeWidth="0.5"
      />
      <rect x={-32} y={cy - 3.5} width={w * value} height={7} rx={1} fill={color} />
    </g>
  )
}

export function DissociationDiagram({ live }: { live: boolean }) {
  const { source, regions } = aversiveModule

  return (
    <svg
      viewBox="0 0 480 330"
      width="100%"
      role="img"
      aria-label="PVN and CeA dissociation of the GLP-1 aversive branch"
      style={{ display: 'block', marginTop: 10, maxHeight: 340 }}
    >
      <defs>
        <marker
          id="av-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-2)" />
        </marker>
      </defs>

      <g style={{ opacity: live ? 1 : 0.4, transition: 'opacity 0.25s' }}>
        {/* edges — PPG-NTS to PVN and CeA, CeA to BNST */}
        <line
          x1={90}
          y1={150}
          x2={GEO.pvn.x - NODE_W / 2}
          y2={GEO.pvn.y}
          stroke="var(--ink-2)"
          strokeWidth="1.4"
          markerEnd="url(#av-arrow)"
        />
        <line
          x1={90}
          y1={166}
          x2={GEO.cea.x - NODE_W / 2}
          y2={GEO.cea.y}
          stroke="var(--ink-2)"
          strokeWidth="1.4"
          markerEnd="url(#av-arrow)"
        />
        <line
          x1={GEO.cea.x + NODE_W / 2}
          y1={GEO.cea.y}
          x2={GEO.bnst.x - NODE_W / 2}
          y2={GEO.bnst.y}
          stroke="var(--ink-2)"
          strokeWidth="1.1"
          markerEnd="url(#av-arrow)"
        />

        {/* source — PPG-NTS */}
        <circle
          cx={SRC.x}
          cy={SRC.y}
          r={SRC.r}
          fill="var(--bg-sunk)"
          stroke="var(--rule-strong)"
          strokeWidth="0.75"
        >
          <title>{source.note}</title>
        </circle>
        <text
          x={SRC.x}
          y={SRC.y - 1}
          textAnchor="middle"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 12, fill: 'var(--ink-1)' }}
        >
          {source.label}
        </text>
        <text
          x={SRC.x}
          y={SRC.y + 11}
          textAnchor="middle"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 6.5,
            letterSpacing: '0.04em',
            fill: 'var(--ink-3)',
          }}
        >
          source
        </text>

        {/* regions */}
        {regions.map((r) => {
          const g = GEO[r.id]
          if (!g) return null
          return (
            <g key={r.id} transform={`translate(${g.x},${g.y})`}>
              <title>{r.note}</title>
              <rect
                x={-NODE_W / 2}
                y={-NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={4}
                fill="var(--bg-paper)"
                stroke="var(--rule-strong)"
                strokeWidth="0.75"
              />
              <text
                x={0}
                y={-NODE_H / 2 + 18}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 14,
                  fill: 'var(--ink-1)',
                }}
              >
                {r.label}
              </text>
              <text
                x={0}
                y={-NODE_H / 2 + 29}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 7,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fill: 'var(--ink-3)',
                }}
              >
                {r.sub}
              </text>
              <DriveBar cy={6} label="HPA" value={r.drives.hpa} color="var(--cool)" />
              <DriveBar
                cy={22}
                label="ANX"
                value={r.drives.anxiety}
                color="var(--accent)"
              />
              <text
                x={0}
                y={NODE_H / 2 + 13}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 9.5,
                  fill: 'var(--ink-2)',
                }}
              >
                {r.outcome}
              </text>
            </g>
          )
        })}
      </g>

      {!live && (
        <text
          x={240}
          y={18}
          textAnchor="middle"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 8.5,
            letterSpacing: '0.04em',
            fill: 'var(--accent)',
          }}
        >
          circuit evidence is rodent · central · acute — extrapolated at this regime
        </text>
      )}
    </svg>
  )
}
