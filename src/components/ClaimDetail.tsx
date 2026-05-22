// The workbench right rail — the courtroom record for one claim. Selecting a
// table row opens this: the claim, then everything that stands behind it
// (evidence observations, papers) and everything it props up (atlas nodes and
// edges). Tension partners are reachable in one click, so a contradiction
// reads as a navigable pair rather than a dead-end caveat.

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  contradictedClaims,
  mechanismRefsForClaim,
  type ResolvedEvidence,
} from '../lib/data'
import type { ClaimRow } from '../lib/claim-table'
import type { Direction, Scope } from '../lib/schemas'
import { Confidence, Eyebrow, ScopeChips } from './atlas'

const DIRECTION: Record<Direction, { glyph: string; label: string }> = {
  increase: { glyph: '↑', label: 'Increase' },
  decrease: { glyph: '↓', label: 'Decrease' },
  no_change: { glyph: '→', label: 'No change' },
  biphasic: { glyph: '↕', label: 'Biphasic' },
  mixed: { glyph: '∿', label: 'Mixed' },
}

const POLARITY_LABEL: Record<string, string> = {
  supports: 'Supports',
  modulates: 'Modulates',
  weakens: 'Weakens',
  contradicts: 'Contradicts',
}

/** An EvidenceObservation carries its own scope — rebuild it for the chips. */
function evidenceScope(ev: ResolvedEvidence): Scope {
  return {
    species: ev.species,
    route: ev.route,
    chronicity: ev.chronicity,
    drug: ev.drug,
    assay: ev.assay,
    n: ev.n,
  }
}

function railShell(children: ReactNode) {
  return (
    <aside
      style={{
        padding: '16px 20px',
        borderLeft: '0.5px solid var(--rule)',
        background: 'var(--bg)',
        overflow: 'auto',
      }}
    >
      {children}
    </aside>
  )
}

export function ClaimDetail({
  row,
  onSelectClaim,
  onClose,
}: {
  row: ClaimRow | null
  onSelectClaim: (claimId: string) => void
  onClose: () => void
}) {
  if (!row) return railShell(<EmptyDetail />)

  const { claim, evidence, contradictedBy } = row.resolved
  const refs = mechanismRefsForClaim(claim.id)
  const contradicts = contradictedClaims(claim)
  const tensionPartners = [
    ...contradicts.map((c) => ({ c, dir: 'contradicts' as const })),
    ...contradictedBy.map((c) => ({ c, dir: 'contradicted-by' as const })),
  ]

  return railShell(
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 12,
        }}
      >
        <Eyebrow>Claim record</Eyebrow>
        <button
          type="button"
          onClick={onClose}
          className="micro"
          style={{
            background: 'transparent',
            border: '0.5px solid var(--rule-strong)',
            borderRadius: 2,
            color: 'var(--ink-3)',
            cursor: 'pointer',
            padding: '2px 6px',
          }}
        >
          ✕ Close
        </button>
      </div>

      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 15.5,
          lineHeight: 1.45,
          color: 'var(--ink-1)',
          margin: '8px 0 10px 0',
          textWrap: 'pretty',
        }}
      >
        {claim.statement}
      </p>

      <div className="claim-meta" style={{ marginBottom: 4 }}>
        <Confidence level={claim.confidence} />
        <span className="sep" />
        <span className="micro" style={{ color: 'var(--ink-3)' }}>
          {POLARITY_LABEL[claim.polarity] ?? claim.polarity}
        </span>
      </div>
      <div style={{ margin: '8px 0 2px 0' }}>
        <ScopeChips scope={claim.scope} />
      </div>
      <div className="micro" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
        Reviewed {claim.lastReviewed}
        {row.staleDays > 90 && (
          <span style={{ color: 'var(--accent)' }}> · stale {row.staleDays}d</span>
        )}
      </div>

      {claim.note && (
        <p className="margin-note margin-rule" style={{ margin: '12px 0 0 0' }}>
          {claim.note}
        </p>
      )}

      {claim.openQuestion && (
        <div
          style={{
            margin: '12px 0 0 0',
            padding: '8px 12px',
            background: 'var(--bg-sunk)',
            borderRadius: 3,
          }}
        >
          <Eyebrow>◇ Open question</Eyebrow>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 12.5,
              lineHeight: 1.5,
              color: 'var(--ink-2)',
              margin: '5px 0 0 0',
            }}
          >
            {claim.openQuestion}
          </p>
        </div>
      )}

      {/* ── Tension partners ── */}
      {tensionPartners.length > 0 && (
        <section style={{ marginTop: 18 }}>
          <Eyebrow accent>⇄ In tension with</Eyebrow>
          <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
            {tensionPartners.map(({ c, dir }) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectClaim(c.id)}
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: 'var(--accent-bg)',
                  border: '0.5px solid var(--accent-rule)',
                  borderLeft: '1.5px solid var(--accent)',
                  borderRadius: 3,
                  padding: '8px 10px',
                }}
              >
                <div className="micro" style={{ color: 'var(--accent)' }}>
                  {dir === 'contradicts'
                    ? 'This claim contradicts →'
                    : '← Contradicted by'}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 12.5,
                    lineHeight: 1.4,
                    color: 'var(--ink-1)',
                    marginTop: 3,
                  }}
                >
                  {c.statement}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Evidence observations ── */}
      <section style={{ marginTop: 18 }}>
        <Eyebrow>
          Evidence · {evidence.length} observation{evidence.length === 1 ? '' : 's'}
        </Eyebrow>
        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          {evidence.map((ev) => {
            const dir = DIRECTION[ev.direction]
            return (
              <div
                key={ev.id}
                style={{
                  border: '0.5px solid var(--rule)',
                  borderRadius: 3,
                  background: 'var(--bg-paper)',
                  padding: '9px 11px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--ink-1)',
                    }}
                  >
                    {ev.paper.cite}
                  </span>
                  <span
                    className="micro"
                    style={{ color: 'var(--ink-2)', whiteSpace: 'nowrap' }}
                    title={dir.label}
                  >
                    {dir.glyph} {dir.label}
                  </span>
                </div>
                {ev.paper.journal && (
                  <div
                    className="micro"
                    style={{ color: 'var(--ink-3)', marginTop: 2, textTransform: 'none' }}
                  >
                    {ev.paper.journal}
                    {ev.paper.year ? ` · ${ev.paper.year}` : ''}
                  </div>
                )}
                <div style={{ margin: '7px 0 0 0' }}>
                  <ScopeChips scope={evidenceScope(ev)} />
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 12,
                    color: 'var(--ink-3)',
                    marginTop: 5,
                  }}
                >
                  {ev.assay}
                  {ev.dose ? ` · ${ev.dose}` : ''}
                  {ev.population ? ` · ${ev.population}` : ''}
                </div>
                {ev.note && (
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 12,
                      lineHeight: 1.45,
                      color: 'var(--ink-2)',
                      margin: '6px 0 0 0',
                      textWrap: 'pretty',
                    }}
                  >
                    {ev.note}
                  </p>
                )}
                {ev.caveats.length > 0 && (
                  <ul
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 11.5,
                      lineHeight: 1.45,
                      color: 'var(--accent)',
                      margin: '6px 0 0 0',
                      padding: '0 0 0 16px',
                    }}
                  >
                    {ev.caveats.map((cav) => (
                      <li key={cav}>{cav}</li>
                    ))}
                  </ul>
                )}
                <div style={{ marginTop: 6 }}>
                  {ev.paper.doi ? (
                    <a
                      href={`https://doi.org/${ev.paper.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="micro"
                      style={{ color: 'var(--ink-2)', textTransform: 'none' }}
                    >
                      doi.org/{ev.paper.doi}
                    </a>
                  ) : (
                    // No registered DOI — point at the paper's bibliography
                    // entry so the citation is still reachable.
                    <Link
                      to={`/bibliography#${ev.paper.id}`}
                      className="micro"
                      style={{ color: 'var(--ink-2)', textTransform: 'none' }}
                    >
                      {ev.paper.cite} · in bibliography ↗
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Atlas footprint — the table-graph link, made lateral ── */}
      <section style={{ marginTop: 18 }}>
        <Eyebrow>
          Atlas footprint · {refs.nodes.length + refs.edges.length} connection
          {refs.nodes.length + refs.edges.length === 1 ? '' : 's'}
        </Eyebrow>
        {refs.nodes.length + refs.edges.length === 0 ? (
          <p className="margin-note" style={{ margin: '8px 0 0 0' }}>
            Not yet wired into the overview graph — a record under review, not a
            drawn edge.
          </p>
        ) : (
          <>
            <p className="margin-note" style={{ margin: '8px 0 8px 0' }}>
              This claim authorises the following on the overview atlas. No edge
              is drawn without a claim behind it.
            </p>
            <div style={{ display: 'grid', gap: 4 }}>
              {refs.nodes.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: 8,
                    fontSize: 12.5,
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  <span className="micro" style={{ color: 'var(--ink-3)' }}>
                    Node
                  </span>
                  <span style={{ color: 'var(--ink-1)' }}>
                    {n.label}
                    {n.sub && (
                      <span style={{ color: 'var(--ink-3)' }}> · {n.sub}</span>
                    )}
                  </span>
                </div>
              ))}
              {refs.edges.map((e) => (
                <div
                  key={e.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: 8,
                    fontSize: 12.5,
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  <span
                    className="micro"
                    style={{
                      color: e.contradiction ? 'var(--accent)' : 'var(--ink-3)',
                    }}
                  >
                    Edge
                  </span>
                  <span style={{ color: 'var(--ink-1)' }}>
                    {e.from} → {e.to}
                    {e.label && (
                      <span style={{ color: 'var(--ink-3)' }}> · {e.label}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </>,
  )
}

function EmptyDetail() {
  return (
    <>
      <Eyebrow>The courtroom layer</Eyebrow>
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
        Every claim in the atlas is on trial here. Select a row to open its
        record — confidence and scope, the evidence observations that back it,
        the papers, and the atlas edges it authorises.
      </p>
      <p className="margin-note margin-rule">
        This is a curated archive, not a search. A row is here because a steward
        placed it here; the workbench shows the backing, not a relevance score.
      </p>
    </>
  )
}
