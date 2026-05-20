// The mesolimbic circuit — VTA → NAc → VP → PFC. A fixed anatomical
// illustration: GLP-1R sits on a sparse, selective subset of these neurons,
// and the NAc shell / ventral pallidum host the μ-opioid and CB1 hedonic
// hotspots that mediate liking — where GLP-1R is only modest.

type Node = { id: string; x: number; y: number; r: number; label: string; sub: string; glyph?: string }
type Edge = { x1: number; y1: number; x2: number; y2: number; w: number; label?: string }

const NODES: Node[] = [
  { id: 'vta', x: 60, y: 130, r: 28, label: 'VTA', sub: 'GLP-1R · TH+', glyph: 'DA' },
  { id: 'nac', x: 200, y: 130, r: 31, label: 'NAc', sub: 'shell · core', glyph: 'μ-OR' },
  { id: 'vp', x: 340, y: 110, r: 26, label: 'VP', sub: 'hedonic hotspot', glyph: 'CB1' },
  { id: 'pfc', x: 400, y: 50, r: 21, label: 'PFC', sub: 'top-down' },
]

const EDGES: Edge[] = [
  { x1: 88, y1: 130, x2: 167, y2: 130, w: 1.6, label: 'DA' },
  { x1: 231, y1: 128, x2: 316, y2: 112, w: 1.6 },
  { x1: 342, y1: 85, x2: 388, y2: 66, w: 1.05 },
  { x1: 393, y1: 71, x2: 228, y2: 112, w: 1.05, label: 'top-down' },
]

export function CircuitDiagram() {
  return (
    <svg
      width="100%"
      viewBox="0 0 460 220"
      style={{ marginTop: 8, maxHeight: 260, display: 'block' }}
      role="img"
      aria-label="Mesolimbic circuit: VTA to NAc to VP to PFC"
    >
      <defs>
        <marker
          id="circuit-arrow"
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

      <rect
        x="2"
        y="2"
        width="456"
        height="216"
        fill="none"
        stroke="var(--rule-soft)"
        strokeWidth="0.5"
      />

      <text
        x={20}
        y={22}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8.5,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fill: 'var(--ink-3)',
        }}
      >
        GLP-1R · selective, sparse
      </text>

      {EDGES.map((e, i) => {
        const mx = (e.x1 + e.x2) / 2
        const my = (e.y1 + e.y2) / 2
        return (
          <g key={i}>
            <line
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="var(--ink-2)"
              strokeWidth={e.w}
              markerEnd="url(#circuit-arrow)"
            />
            {e.label && (
              <text
                x={mx}
                y={my - 5}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fill: 'var(--ink-2)',
                }}
              >
                {e.label}
              </text>
            )}
          </g>
        )
      })}

      {NODES.map((n) => (
        <g key={n.id} transform={`translate(${n.x},${n.y})`}>
          <circle
            r={n.r}
            fill="var(--bg-paper)"
            stroke="var(--rule-strong)"
            strokeWidth="0.75"
          />
          {n.glyph && (
            <text
              textAnchor="middle"
              dy={-3}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 8,
                letterSpacing: '0.04em',
                fill: 'var(--ink-3)',
              }}
            >
              {n.glyph}
            </text>
          )}
          <text
            textAnchor="middle"
            dy={n.glyph ? 10 : 4}
            style={{ fontFamily: 'var(--font-serif)', fontSize: 12, fill: 'var(--ink-1)' }}
          >
            {n.label}
          </text>
          <text
            textAnchor="middle"
            dy={n.r + 13}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fill: 'var(--ink-3)',
            }}
          >
            {n.sub}
          </text>
        </g>
      ))}

      <text
        x={230}
        y={205}
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 11,
          fill: 'var(--ink-2)',
        }}
      >
        NAc shell and VP host the μ-opioid / CB1 hedonic hotspots — modest GLP-1R there
        is mechanistically interesting.
      </text>
    </svg>
  )
}
