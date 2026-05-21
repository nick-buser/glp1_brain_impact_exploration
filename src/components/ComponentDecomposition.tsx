// The component-decomposition panel — the core of the phenomenology mapper.
// A resolved report is rendered as a stack of candidate components, strongest
// fit first. Each carries a likelihood label, a weighted bar, the rationale,
// and — expandable — the claims that back it. The bar's width is curated fit
// magnitude; an `uncertain` candidate is hatched rather than solid, because
// "we don't know how big" is not the same as "small". A candidate with no
// backing claim says so plainly: that is an honest gap in the graph, not a bug.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClaimCard } from './atlas'
import { LIKELIHOOD, type ResolvedReport } from '../lib/phenomenology'

export function ComponentDecomposition({ report }: { report: ResolvedReport }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
      {report.candidates.map((cand) => {
        const meta = LIKELIHOOD[cand.likelihood]
        const isOpen = open === cand.component.id
        const pct = Math.round(cand.weight * 100)

        return (
          <div key={cand.component.id} className="ph-cand">
            <div className="ph-cand-head">
              <span className="ph-cand-label">{cand.component.label}</span>
              <span className={'ph-like ph-like--' + cand.likelihood}>
                {meta.label} likelihood
              </span>
              {cand.component.mechanismPath && (
                <Link to={cand.component.mechanismPath} className="ph-cand-link">
                  open module ↗
                </Link>
              )}
            </div>

            <div
              className="ph-bar"
              role="img"
              aria-label={`${cand.component.label}: ${meta.label} likelihood${
                meta.unknown ? ' — magnitude uncertain' : ''
              }`}
            >
              <div className="ph-bar-track" />
              <div
                className={'ph-bar-fill' + (meta.unknown ? ' uncertain' : '')}
                style={{ width: `${pct}%` }}
              />
            </div>

            <p className="ph-cand-gloss">{cand.component.gloss}</p>
            <p className="ph-cand-rationale">{cand.rationale}</p>

            {cand.claims.length > 0 ? (
              <>
                <button
                  type="button"
                  className="ph-evidence-toggle"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : cand.component.id)}
                >
                  {isOpen ? '▾' : '▸'} {cand.claims.length} backing claim
                  {cand.claims.length > 1 ? 's' : ''}
                </button>
                {isOpen && (
                  <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                    {cand.claims.map((rc) => (
                      <ClaimCard key={rc.claim.id} resolved={rc} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="ph-no-evidence">
                No claim in the graph stratifies this channel — an honest gap, not a
                dismissal.
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
