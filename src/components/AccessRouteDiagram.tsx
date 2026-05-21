// The access-route diagram — the conceptual hero of the brain-access module.
//
// One picture has to carry the correction: a peripheral drug does not flood
// the brain. The left band is circulation; a dashed seam is the blood-brain
// barrier. Portal nodes sit at circumventricular windows where the seam is
// open; the transit node is reached only by slow transcytosis through it; the
// deep limbic nodes on the right are never reached directly — dashed
// second-order projections are their only inbound path, and they stay dim
// whichever route is selected. Selecting a route lights its arrows and the
// nodes it serves; the rest recede.

import type { AccessModule, AccessRegion } from '../lib/schemas'

const NODE_W = 80
const NODE_H = 38
const CIRC_X = 20
const CIRC_W = 52
const BARRIER_X = 116

const DENSITY_BARS: Record<AccessRegion['glp1r'], number> = {
  high: 3,
  moderate: 2,
  low: 1,
}

// Second-order projections: a deep limbic node's only inbound path.
const PROJECTIONS: Array<[string, string]> = [
  ['arc', 'nac'],
  ['arc', 'hpc'],
  ['ap', 'vta'],
  ['nts', 'amy'],
]

/** The route a node belongs to — explicit for portals, implied for transit. */
function owningRoute(r: AccessRegion): string | undefined {
  if (r.routeId) return r.routeId
  if (r.tier === 'transit') return 'transcytosis'
  return undefined
}

function GlpBars({ level }: { level: AccessRegion['glp1r'] }) {
  const on = DENSITY_BARS[level]
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={i * 4.5}
          y={-3}
          width={3}
          height={6}
          rx={0.5}
          fill={i < on ? 'var(--ink-1)' : 'var(--ink-4)'}
        />
      ))}
    </g>
  )
}

function Node({ r, dim }: { r: AccessRegion; dim: boolean }) {
  const projection = r.tier === 'projection'
  return (
    <g
      transform={`translate(${r.x},${r.y})`}
      style={{
        opacity: dim ? 0.3 : projection ? 0.62 : 1,
        transition: 'opacity 0.25s',
      }}
    >
      <title>{r.note}</title>
      <rect
        x={-NODE_W / 2}
        y={-NODE_H / 2}
        width={NODE_W}
        height={NODE_H}
        rx={4}
        fill={projection ? 'var(--bg-sunk)' : 'var(--bg-paper)'}
        stroke={projection ? 'var(--rule-strong)' : 'var(--rule-strong)'}
        strokeWidth={projection ? 0.5 : 0.9}
        strokeDasharray={r.tier === 'portal' ? undefined : '2.5 2'}
      />
      <text
        x={0}
        y={-NODE_H / 2 + 14}
        textAnchor="middle"
        style={{ fontFamily: 'var(--font-serif)', fontSize: 12, fill: 'var(--ink-1)' }}
      >
        {r.label}
      </text>
      <text
        x={0}
        y={-NODE_H / 2 + 24}
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 6,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        {r.sub}
      </text>
      <g transform={`translate(${-NODE_W / 2 + 8},${NODE_H / 2 - 7})`}>
        <text
          x={0}
          y={2.5}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 5.6,
            letterSpacing: '0.04em',
            fill: 'var(--ink-3)',
          }}
        >
          GLP-1R
        </text>
        <g transform="translate(30,0)">
          <GlpBars level={r.glp1r} />
        </g>
      </g>
      {projection && (
        <text
          x={NODE_W / 2 - 7}
          y={NODE_H / 2 - 5}
          textAnchor="end"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 6.5,
            fill: 'var(--accent)',
          }}
        >
          2°
        </text>
      )}
    </g>
  )
}

export function AccessRouteDiagram({
  module,
  activeRouteId,
}: {
  module: AccessModule
  activeRouteId: string
}) {
  const byId = new Map(module.regions.map((r) => [r.id, r]))
  const left = (r: AccessRegion) => r.x - NODE_W / 2
  const cvoNodes = module.regions.filter((r) => r.routeId === 'cvo')

  return (
    <svg
      viewBox="0 0 480 372"
      width="100%"
      role="img"
      aria-label="Brain-access routes: circulation, the blood-brain barrier, circumventricular portal nodes, and deep limbic nodes reached only by second-order projection"
      style={{ display: 'block', marginTop: 10, maxHeight: 420 }}
    >
      <defs>
        <marker
          id="ax-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-2)" />
        </marker>
        <marker
          id="ax-arrow-accent"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>

      {/* ── Circulation column ─────────────────────────────────────────── */}
      <rect
        x={CIRC_X}
        y={50}
        width={CIRC_W}
        height={266}
        rx={5}
        fill="var(--accent-bg)"
        stroke="var(--accent-rule)"
        strokeWidth={0.5}
      />
      <text
        x={CIRC_X + CIRC_W / 2}
        y={42}
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 7,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        Blood
      </text>
      {[78, 120, 168, 210, 252, 294].map((cy, i) => (
        <circle
          key={i}
          cx={CIRC_X + CIRC_W / 2 + (i % 2 ? 9 : -9)}
          cy={cy}
          r={4.5}
          fill="var(--accent-soft)"
          opacity={0.7}
        >
          <title>Peripherally dosed drug — too large to cross an intact barrier</title>
        </circle>
      ))}

      {/* ── The blood-brain barrier seam ──────────────────────────────── */}
      <line
        x1={BARRIER_X}
        y1={52}
        x2={BARRIER_X}
        y2={356}
        stroke="var(--ink-3)"
        strokeWidth={1.2}
        strokeDasharray="3 3"
      />
      <text
        x={BARRIER_X}
        y={366}
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 6.8,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        blood–brain barrier
      </text>
      {/* CVO windows — gaps in the seam where circumventricular organs sit */}
      {cvoNodes.map((r) => {
        const on = activeRouteId === 'cvo'
        return (
          <g key={'win-' + r.id} style={{ transition: 'opacity 0.25s' }}>
            <rect
              x={BARRIER_X - 3.5}
              y={r.y - 13}
              width={7}
              height={26}
              fill="var(--bg)"
            />
            {[-13, 13].map((dy) => (
              <line
                key={dy}
                x1={BARRIER_X - 5}
                y1={r.y + dy}
                x2={BARRIER_X + 5}
                y2={r.y + dy}
                stroke={on ? 'var(--accent)' : 'var(--ink-3)'}
                strokeWidth={1}
              />
            ))}
          </g>
        )
      })}

      {/* ── Second-order projections (always faint — the standing point) ── */}
      {PROJECTIONS.map(([from, to]) => {
        const a = byId.get(from)
        const b = byId.get(to)
        if (!a || !b) return null
        const x1 = a.x + NODE_W / 2
        const x2 = b.x - NODE_W / 2
        const mx = (x1 + x2) / 2
        return (
          <path
            key={from + to}
            d={`M ${x1} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${x2} ${b.y}`}
            fill="none"
            stroke="var(--ink-4)"
            strokeWidth={0.9}
            strokeDasharray="3 2.5"
            markerEnd="url(#ax-arrow)"
            opacity={0.7}
          />
        )
      })}

      {/* ── Route arrows ───────────────────────────────────────────────── */}
      {/* CVO route — circulation through the windows to portal nodes */}
      {cvoNodes.map((r) => {
        const on = activeRouteId === 'cvo'
        return (
          <line
            key={'cvo-' + r.id}
            x1={CIRC_X + CIRC_W}
            y1={r.y}
            x2={left(r)}
            y2={r.y}
            stroke={on ? 'var(--accent)' : 'var(--ink-3)'}
            strokeWidth={on ? 1.6 : 1}
            markerEnd={on ? 'url(#ax-arrow-accent)' : 'url(#ax-arrow)'}
            style={{ opacity: on ? 1 : 0.3, transition: 'opacity 0.25s' }}
          />
        )
      })}
      {/* Transcytosis route — a slow dotted leak across the intact seam */}
      {(() => {
        const ls = byId.get('ls')
        if (!ls) return null
        const on = activeRouteId === 'transcytosis'
        return (
          <g style={{ opacity: on ? 1 : 0.3, transition: 'opacity 0.25s' }}>
            <line
              x1={CIRC_X + CIRC_W}
              y1={ls.y}
              x2={left(ls)}
              y2={ls.y}
              stroke={on ? 'var(--accent)' : 'var(--ink-3)'}
              strokeWidth={on ? 1.6 : 1}
              strokeDasharray="1.5 3"
              markerEnd={on ? 'url(#ax-arrow-accent)' : 'url(#ax-arrow)'}
            />
            <text
              x={(CIRC_X + CIRC_W + left(ls)) / 2}
              y={ls.y - 6}
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 6.5,
                fill: on ? 'var(--accent)' : 'var(--ink-3)',
              }}
            >
              slow · over hours
            </text>
          </g>
        )
      })()}
      {/* Vagal route — gut afferent to the NTS, signal not drug */}
      {(() => {
        const nts = byId.get('nts')
        if (!nts) return null
        const on = activeRouteId === 'vagal'
        const gx = CIRC_X + CIRC_W / 2
        const gy = 346
        return (
          <g style={{ opacity: on ? 1 : 0.3, transition: 'opacity 0.25s' }}>
            <circle
              cx={gx}
              cy={gy}
              r={11}
              fill="var(--bg-paper)"
              stroke={on ? 'var(--accent)' : 'var(--rule-strong)'}
              strokeWidth={0.9}
            />
            <text
              x={gx}
              y={gy + 2.5}
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 6.5,
                letterSpacing: '0.03em',
                fill: 'var(--ink-2)',
              }}
            >
              GUT
            </text>
            <path
              d={`M ${gx + 11} ${gy} C ${gx + 70} ${gy}, ${left(nts) - 36} ${nts.y}, ${left(nts)} ${nts.y}`}
              fill="none"
              stroke={on ? 'var(--accent)' : 'var(--ink-3)'}
              strokeWidth={on ? 1.6 : 1}
              markerEnd={on ? 'url(#ax-arrow-accent)' : 'url(#ax-arrow)'}
            />
            <text
              x={gx + 52}
              y={gy - 5}
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 6.5,
                fill: on ? 'var(--accent)' : 'var(--ink-3)',
              }}
            >
              vagus nerve
            </text>
          </g>
        )
      })()}

      {/* ── Nodes ──────────────────────────────────────────────────────── */}
      {module.regions.map((r) => {
        const route = owningRoute(r)
        const dim = r.tier !== 'projection' && route !== activeRouteId
        return <Node key={r.id} r={r} dim={dim} />
      })}

      {/* Column captions */}
      <text
        x={196}
        y={36}
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 7,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        Portal nodes · barrier-accessible
      </text>
      <text
        x={392}
        y={36}
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 7,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        Deep limbic · second-order only
      </text>
    </svg>
  )
}
