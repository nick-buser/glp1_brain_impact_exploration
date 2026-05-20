// The overview atlas graph — a hand-laid SVG circuit that every lens
// re-projects rather than replaces. Edges run behind nodes; each is backed by
// at least one claim (enforced by the schema). Translated from
// designs/artboard-overview.jsx.

import { dataset } from '../lib/data'
import type { AtlasEdge, AtlasNode, Confidence } from '../lib/schemas'
import { lensById, projectEdge, projectNode, showBBB, type LensId } from '../lib/lens'

const VIEW_W = 1380
const VIEW_H = 720

const LANES: { x: number; text: string; anchor: 'middle' | 'start' }[] = [
  { x: 80, text: 'Periphery', anchor: 'middle' },
  { x: 230, text: 'Access', anchor: 'middle' },
  { x: 410, text: 'Brainstem · hypothalamus', anchor: 'start' },
  { x: 750, text: 'Limbic · mesolimbic', anchor: 'start' },
  { x: 1040, text: 'Cortex', anchor: 'middle' },
  { x: 1220, text: 'Outcome · phenomenology', anchor: 'start' },
]

const EDGE_WIDTH: Record<Confidence, number> = {
  strong: 1.6,
  moderate: 1.05,
  speculative: 0.65,
  contradicted: 1.1,
  open: 0.65,
}

/** Half-extents used to trim edges to the node boundary so arrowheads show. */
function nodeRadius(n: AtlasNode): { rx: number; ry: number } {
  if (n.kind === 'outcome') return { rx: 72, ry: 16 }
  const r = (n.size ?? 56) / 2
  return { rx: r, ry: r }
}

/** Point on `node`'s boundary along the line toward (tx, ty). */
function boundary(node: AtlasNode, tx: number, ty: number, pad = 3) {
  const dx = tx - node.x
  const dy = ty - node.y
  const { rx, ry } = nodeRadius(node)
  if (dx === 0 && dy === 0) return { x: node.x, y: node.y }
  const scale = 1 / Math.max(Math.abs(dx) / (rx + pad), Math.abs(dy) / (ry + pad))
  return { x: node.x + dx * scale, y: node.y + dy * scale }
}

export function AtlasGraph({
  lens,
  selectedId,
  onSelect,
}: {
  lens: LensId
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  const { nodes, edges } = dataset.atlas
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      style={{ display: 'block' }}
      role="img"
      aria-label="GLP-1 brain mechanism overview graph"
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-2)" />
        </marker>
        <marker
          id="arrow-accent"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
        <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--rule-soft)" strokeWidth="0.25" />
        </pattern>
        <pattern
          id="bbb"
          x="0"
          y="0"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(15)"
        >
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--rule-strong)" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#grid)" opacity="0.45" />

      {/* deselect on background click */}
      <rect
        x="0"
        y="0"
        width={VIEW_W}
        height={VIEW_H}
        fill="transparent"
        onClick={() => onSelect(null)}
      />

      {LANES.map((l) => (
        <text
          key={l.text}
          x={l.x}
          y={64}
          textAnchor={l.anchor}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fill: 'var(--ink-3)',
          }}
        >
          {l.text}
        </text>
      ))}

      {showBBB(lens) && (
        <g opacity={lens === 'anatomical' ? 0.85 : 0.4}>
          <rect x="305" y="100" width="18" height="600" fill="url(#bbb)" />
          <text
            x="314"
            y="92"
            textAnchor="middle"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8.5,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fill: 'var(--ink-3)',
            }}
          >
            BBB
          </text>
        </g>
      )}

      {/* Edges behind nodes */}
      {edges.map((e) => {
        const f = nodeMap.get(e.from)
        const t = nodeMap.get(e.to)
        if (!f || !t) return null
        return (
          <EdgeLine
            key={e.id}
            edge={e}
            from={f}
            to={t}
            lens={lens}
            faded={Boolean(selectedId) && selectedId !== e.from && selectedId !== e.to}
          />
        )
      })}

      {/* Nodes */}
      {nodes.map((n) => (
        <NodeShape
          key={n.id}
          node={n}
          lens={lens}
          selected={selectedId === n.id}
          onClick={() => onSelect(selectedId === n.id ? null : n.id)}
        />
      ))}

      {/* Lens legend */}
      <g transform="translate(28, 678)">
        <text
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fill: 'var(--ink-3)',
          }}
        >
          Lens projection
        </text>
        <text
          y={16}
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 12.5,
            fill: 'var(--ink-2)',
          }}
        >
          {lensById.get(lens)?.legend}
        </text>
      </g>
    </svg>
  )
}

function EdgeLine({
  edge,
  from,
  to,
  lens,
  faded,
}: {
  edge: AtlasEdge
  from: AtlasNode
  to: AtlasNode
  lens: LensId
  faded: boolean
}) {
  const proj = projectEdge(edge, lens)
  const p1 = boundary(from, to.x, to.y)
  const p2 = boundary(to, from.x, from.y)
  const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }

  const width = EDGE_WIDTH[edge.confidence]
  const stroke = edge.contradiction ? 'var(--accent)' : 'var(--ink-2)'
  const dash =
    edge.dashed || edge.confidence === 'speculative'
      ? '3 3'
      : edge.confidence === 'open'
        ? '1 4'
        : undefined
  const opacity = proj.dim
    ? 0.16
    : faded
      ? 0.3
      : edge.confidence === 'speculative' || edge.confidence === 'open'
        ? 0.6
        : 1

  return (
    <g style={{ opacity, transition: 'opacity .25s' }}>
      <line
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke={stroke}
        strokeWidth={width}
        strokeDasharray={dash}
        markerEnd={edge.contradiction ? 'url(#arrow-accent)' : 'url(#arrow)'}
      />
      {proj.showLabel && edge.label && (
        <text
          x={mid.x}
          y={mid.y - 5}
          textAnchor="middle"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fill: stroke,
          }}
        >
          {edge.label}
        </text>
      )}
      {proj.showContext && edge.contextNote && (
        <text
          x={mid.x}
          y={mid.y + 11}
          textAnchor="middle"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 8.5,
            fill: 'var(--ink-3)',
            fontStyle: 'italic',
          }}
        >
          {edge.contextNote}
        </text>
      )}
    </g>
  )
}

function NodeShape({
  node,
  lens,
  selected,
  onClick,
}: {
  node: AtlasNode
  lens: LensId
  selected: boolean
  onClick: () => void
}) {
  const proj = projectNode(node, lens)
  const accent = proj.accent || Boolean(node.contradiction || node.bidirectional)
  const stroke = accent
    ? 'var(--accent)'
    : selected
      ? 'var(--ink-1)'
      : 'var(--rule-strong)'

  if (node.kind === 'outcome') {
    return (
      <g
        className="node-hit"
        transform={`translate(${node.x},${node.y})`}
        opacity={proj.dim ? 0.3 : 1}
        style={{ transition: 'opacity .25s' }}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        role="button"
        aria-label={node.label}
      >
        <rect
          x={-70}
          y={-14}
          width={140}
          height={28}
          rx={2}
          fill="var(--bg-paper)"
          stroke={stroke}
          strokeWidth={selected ? 1.5 : accent ? 1 : 0.5}
          strokeDasharray={node.bidirectional ? '3 2' : undefined}
        />
        <text
          x={0}
          y={4}
          textAnchor="middle"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 12.5,
            fill: node.contradiction ? 'var(--accent)' : 'var(--ink-1)',
          }}
        >
          {node.label}
        </text>
        {node.contradiction && (
          <text
            x={64}
            y={-2}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--accent)' }}
          >
            ⇄
          </text>
        )}
        {node.bidirectional && (
          <text
            x={64}
            y={-2}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--accent)' }}
          >
            ↕
          </text>
        )}
      </g>
    )
  }

  const r = (node.size ?? 56) / 2
  return (
    <g
      className="node-hit"
      transform={`translate(${node.x},${node.y})`}
      opacity={proj.dim ? 0.35 : 1}
      style={{ transition: 'opacity .25s' }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      role="button"
      aria-label={node.label}
    >
      <circle
        r={r}
        fill="var(--bg-paper)"
        stroke={stroke}
        strokeWidth={selected ? 1.75 : accent ? 1.25 : 0.75}
      />
      <text
        textAnchor="middle"
        dy={4}
        style={{ fontFamily: 'var(--font-serif)', fontSize: 12.5, fill: 'var(--ink-1)' }}
      >
        {node.label}
      </text>
      {node.sub && (
        <text
          textAnchor="middle"
          dy={r + 14}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fill: 'var(--ink-3)',
          }}
        >
          {node.sub}
        </text>
      )}
    </g>
  )
}
