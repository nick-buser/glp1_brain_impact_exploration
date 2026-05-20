// Right rail — provenance. Follows the graph selection across lens changes.
// No selection: orientation + a "recently updated" garden surface.

import { claimsForNode, dataset, daysSinceReviewed } from '../lib/data'
import { lensById, type LensId } from '../lib/lens'
import type { AtlasNode } from '../lib/schemas'
import { ClaimCard, Eyebrow } from './atlas'

const KIND_LABEL: Record<AtlasNode['kind'], string> = {
  drug: 'Periphery',
  endogenous: 'Periphery',
  access: 'Access layer',
  region: 'Brain region',
  outcome: 'Outcome',
}

export function ProvenancePanel({
  node,
  lens,
}: {
  node: AtlasNode | null
  lens: LensId
}) {
  if (!node) return <EmptyPanel />

  const resolved = claimsForNode(node.id)
  const contradicted = resolved.filter(
    (r) => r.claim.confidence === 'contradicted' || r.contradictedBy.length > 0,
  )

  return (
    <aside
      style={{
        padding: '16px 20px',
        borderLeft: '0.5px solid var(--rule)',
        background: 'var(--bg)',
        overflow: 'auto',
      }}
    >
      <Eyebrow>{KIND_LABEL[node.kind]}</Eyebrow>
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 18,
          fontWeight: 400,
          margin: '4px 0',
          letterSpacing: '-0.005em',
        }}
      >
        {node.label}
      </h3>
      {node.sub && (
        <div className="micro" style={{ color: 'var(--ink-3)', marginBottom: 12 }}>
          {node.sub}
        </div>
      )}

      {contradicted.length > 0 && (
        <div
          className="margin-note"
          style={{
            margin: '0 0 12px 0',
            padding: '8px 12px',
            background: 'var(--accent-bg)',
            borderLeft: '1.5px solid var(--accent)',
            fontStyle: 'normal',
            color: 'var(--ink-1)',
          }}
        >
          <span className="eyebrow" style={{ color: 'var(--accent)', marginRight: 6 }}>
            ⇄ Tension
          </span>
          This node carries a live contradiction — claims that pull against each other,
          shown as structure rather than hedged in prose.
        </div>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {resolved.length === 0 && (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 13,
              color: 'var(--ink-2)',
              fontStyle: 'italic',
            }}
          >
            No claims attached to this node yet.
          </p>
        )}
        {resolved.map((r) => (
          <ClaimCard key={r.claim.id} resolved={r} />
        ))}
      </div>

      <hr className="hr" style={{ margin: '16px 0 12px 0' }} />
      <div className="margin-note">
        Lens currently set to <strong>{lensById.get(lens)?.label.toLowerCase()}</strong> —
        claim emphasis follows the lens.
      </div>
    </aside>
  )
}

function EmptyPanel() {
  const recent = [...dataset.claims]
    .sort((a, b) => b.lastReviewed.localeCompare(a.lastReviewed))
    .slice(0, 5)

  return (
    <aside
      style={{
        padding: '16px 20px',
        borderLeft: '0.5px solid var(--rule)',
        background: 'var(--bg)',
        overflow: 'auto',
      }}
    >
      <Eyebrow>No selection</Eyebrow>
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 13,
          lineHeight: 1.55,
          color: 'var(--ink-2)',
          margin: '12px 0',
          textWrap: 'pretty',
        }}
      >
        Click any node to surface its claims — each with confidence, scope conditions, and
        evidence count. The rail follows the selection as you switch lenses.
      </p>
      <hr className="hr" />
      <div style={{ marginTop: 16 }}>
        <Eyebrow>Recently reviewed</Eyebrow>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '10px 0 0 0',
            display: 'grid',
            gap: 10,
          }}
        >
          {recent.map((c) => {
            const fresh = daysSinceReviewed(c) <= 90
            return (
              <li
                key={c.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 8,
                  fontFamily: 'var(--font-serif)',
                  fontSize: 12.5,
                }}
              >
                <span
                  className="micro"
                  style={{ color: fresh ? 'var(--accent)' : 'var(--ink-3)', paddingTop: 2 }}
                >
                  {fresh ? '●' : '○'}
                </span>
                <div>
                  <div style={{ color: 'var(--ink-1)', lineHeight: 1.35 }}>
                    {c.statement.length > 88
                      ? c.statement.slice(0, 88).trimEnd() + '…'
                      : c.statement}
                  </div>
                  <div className="micro" style={{ color: 'var(--ink-3)', marginTop: 2 }}>
                    {c.lastReviewed}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
